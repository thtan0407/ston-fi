let windowWidth = $('body').width();

let handleApplyCollapse = function ($parent, $firstItem = false, $callFunction = false) {
	let $childUl = $parent.find('> li > ul');
	if ($childUl.length === 0) {
		return;
	}

	if ($callFunction) {
		$parent.find('> li a').each(function () {
			$(this).attr('data-href', $(this).attr('href'))
		});
	}

	let $parentID = '';

	if ($firstItem) {
		$parentID = 'menu-' + Math.random().toString(36).substring(7);
		$parent.attr('id', $parentID);
	}

	if (windowWidth <= 1023) {
		let $objParentAttr = {};
		let $objChildrenAttr = {
			'data-bs-parent': '#' + $parent.attr('id')
		}

		if ($firstItem) {
			$objParentAttr = {
				'data-bs-parent': '#' + $parentID
			}

			$objChildrenAttr = {};
		}

		$childUl.each(function () {
			let $parentUl = $(this).closest('ul');
			let $parentListItem = $(this).closest('li');
			let $parentListItemAnchor = $parentListItem.children('a');

			let $parentUlID = 'menu-' + Math.random().toString(36).substring(7);

			if (!$parentUl.hasClass('collapse')) {
				$parentUl.addClass('collapse').attr({
					'id': 'collapse-' + $parentUlID, ...$objParentAttr, ...$objChildrenAttr
				});

				$parentListItemAnchor.replaceWith(function () {
					return `<button aria-label="${$parentListItemAnchor.attr('aria-label')}" data-href="${$parentListItemAnchor.attr('data-href')}" data-bs-toggle="collapse" aria-expanded="false" data-bs-target="#${$parentUl.attr('id')}">${$parentListItemAnchor.html()}</button>`
				})

				handleApplyCollapse($parentUl, false);

				$parentUl.on('show.bs.collapse', function () {
					$parentListItem.children('button').attr('aria-expanded', true);
					$parent.find('.collapse.show').not($parentUl).collapse('hide').each(function () {
						$(this).siblings('li').children('button').attr('aria-expanded', false);
					});
				}).on('hide.bs.collapse', function () {
					$parentListItem.children('button').attr('aria-expanded', false);
				});
			}
		});
	} else {
		$childUl.each(function () {
			let $parentUl = $(this).closest('ul');
			let $parentListItem = $(this).closest('li');

			$parentUl.removeClass('collapse').removeAttr('data-bs-parent id');
			$parentListItem.children('a').attr('href', $parentListItem.children('a').attr('data-href'));

			$parentListItem.children('button').replaceWith(function () {
				return `<a aria-label="${$(this).attr('aria-label')}" href="${$(this).attr('data-href')}" data-href="${$(this).attr('data-href')}">${$(this).html()}</a>`
			})

			handleApplyCollapse($parentUl);
		});
	}
}

let handleCallMenu = function () {
	const $body = $('body');
	const handleBody = function ($toggle = false) {
		if ($body.hasClass('is-navigation')) {
			$body.removeClass('is-navigation');
			if ($body.hasClass('is-overflow')) {
				$body.removeClass('is-overflow');
			}

			$('#headerNavigation ul').collapse('hide');
		} else {
			if ($toggle) {
				$body.addClass('is-navigation is-overflow')
			}
		}
	}

	if (windowWidth <= 1023) {
		const $hamburger = $('#hamburgerButton');
		if ($hamburger.length) {
			$hamburger.off('click').on('click', function () {
				handleBody(true)
			});
		}

		const $overlay = $('#headerOverlay');
		if ($overlay.length) {
			$overlay.off('click').on('click', function () {
				handleBody();
			});
		}
	} else {
		handleBody();
	}
}

const handleStickHeader = function () {
	$(window).scroll(function (e) {
		if ($(document).scrollTop() > $('#header').innerHeight()) {
			$('#header').addClass('is-scroll');
		} else {
			$('#header').removeClass('is-scroll');
		}
	});
}

const handleHeader = function () {
	handleApplyCollapse($('#headerNavigation > ul'), true, true);
	handleCallMenu();
	handleStickHeader();
	$(window).resize(function () {
		let newWindowWidth = $('body').width();
		if (newWindowWidth !== windowWidth) {
			windowWidth = newWindowWidth;
			handleApplyCollapse($('#headerNavigation > ul'));
			handleCallMenu();
		}
	});
}

const handleSwiper = function (elm, obj = {}) {
	return new Swiper(elm, {
		loop: true,
		speed: 1000,
		autoplay: {
			delay: 8000,
			disableOnInteraction: true,
		},
		slidesPerView: 1,
		...obj
	});
}

$(function () {
	handleHeader();


	if ($('#sliderWallet').length > 0) {
		const elmSwiper = '#sliderWallet';
		const objSwiper = {
			loop: true,
			speed: 500,
			autoplay: false,
			slidesPerView: 1,
			effect: 'fade',
			fadeEffect: {
				crossFade: true
			},
			navigation: {
				nextEl: elmSwiper + " .sliderNext",
				prevEl: elmSwiper + " .sliderPrev",
			},
		}
		handleSwiper(elmSwiper + ' .swiper', objSwiper);
	}

	if ($('[data-bs-toggle="popover"]').length) {
		$('[data-bs-toggle="popover"]').popover({
			trigger: 'focus hover',
			html: true,
		})
	}
});


