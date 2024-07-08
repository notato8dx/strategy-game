{
	const createElement = (
		tag: string,
		{
			classes = [],
			style = {},
			...attributes
		}: {
			classes?: string[],
			style?: {
				[key: string]: any
			},
			[key: string]: any
		} = {},
		...children: (string | Node)[]
	) => {
		const element = document.createElement(tag)
		Object.assign(element, attributes)
		Object.assign(element.style, style)
		element.className = classes.join(' ')
		element.replaceChildren(...children)
		return element
	}

	const towerButtons = [
		createElement('img'),
		createElement('img'),
		createElement('img')
	].map(towerImg => {
		const towerButton: {
			deselectButton: HTMLElement,
			selectButton: Element | null,
			img: Element,
			icon: string
		} = {
			deselectButton: createElement(
				'button',
				{
					disabled: true,
					onclick: () => {
						towerButton.deselectButton.setAttribute('disabled', '')
						playButton.setAttribute('disabled', '')
					
						towerButton.selectButton?.removeAttribute('disabled')
						towerButton.selectButton = null
						towerButton.img.removeAttribute('alt')
						towerButton.icon = ''
					}
				},
				towerImg
			),
			selectButton: null,
			img: towerImg,
			icon: ''
		}

		return towerButton
	})

	const menu = createElement(
		'div',
		{
			id: 'menu',
			classes: [ 'panel' ],
			style: {
				zIndex: '1',
				backgroundColor: '#00000080'
			}
		},
		createElement('ul', {}, ...[
			{
				name: 'Lynx',
				icon: '🐈'
			},
			{
				name: 'Lamp Prey',
				icon: '🦋'
			},
			{
				name: 'Titanicorn',
				icon: '🦄'
			},
			{
				name: 'Angler',
				icon: '🐟'
			},
			{
				name: 'Fer de Fae',
				icon: '🐍'
			}
		].map(tower => createElement(
			'li',
			{},
			createElement(
				'button',
				{
					onclick: function(this: HTMLElement) {
						const towerButton = towerButtons.find(({ selectButton }) => {
							return !selectButton
						})
					
						if (towerButton) {
							this.setAttribute('disabled', '')
							towerButton.selectButton = this
							towerButton.deselectButton.removeAttribute('disabled')
							towerButton.img.setAttribute('alt', tower.icon)
							towerButton.icon = tower.icon
					
							if (towerButtons.every(({ selectButton }) => {
								return selectButton
							})) {
								playButton.removeAttribute('disabled')
							}
						}
					}
				},
				createElement('img', {
					alt: tower.icon
				})
			),
			tower.name
		))),
		createElement('ul')
	)

	const tiles = [
		[ '', '', '', '', '', 'raised', '', 'raised', 'raised' ],
		[ 'raised', 'raised', 'raised', 'raised', '', '', '', '', '' ],
		[ 'raised', 'raised', 'raised', 'raised', '', 'raised', '', '', '' ],
		[ 'water', 'water', 'water', 'water', '', 'raised', 'raised', 'raised', 'raised' ],
		[ '', '', '', '', '', 'raised', 'raised', 'raised', 'raised' ]
	].map(row => {
		return row.map(tile => {
			const image = createElement('img', {
				src: ''
			})

			return {
				floor: createElement(
					'div',
					{
						classes: tile != '' ? [ `${tile}-tile` ] : []
					},
					createElement('div'),
					image
				),
				image
			}
		})
	})

	const playButton = createElement(
		'button',
		{
			id: 'play-button',
			disabled: true,
			onclick: () => {
				menu.remove()
				menuButtons.replaceChildren()

				for (const towerButton of towerButtons) {
					towerButton.deselectButton.onclick = () => {
						for (const row of tiles) {
							for (const tile of row) {
								tile.floor.onmouseover = () => {
									tile.image.setAttribute('alt', towerButton.icon)
								}

								tile.floor.onmouseout = () => {
									tile.image.removeAttribute('alt')
								}
							}
						}
					}
				}
			}
		},
		'▶️'
	)

	const menuButtons = createElement(
		'div',
		{
			id: 'menu-buttons',
			style: {
				flex: 'auto'
			}
		},
		createElement(
			'button',
			{
				onclick: function hideMenu() {
					menu.style.display = 'none'
				
					this.onclick = () => {
						menu.style.display = ''
						this.onclick = hideMenu
					}
				}
			},
			'👁️'
		),
		playButton
	)

	document.body.replaceChildren(
		createElement(
			'div',
			{
				id: 'main',
				style: {
					flex: 'auto',
					position: 'relative',
					overflow: 'hidden'
				}
			},
			menu,
			createElement(
				'div',
				{
					id: 'grid', 
					style: {
						flexDirection: 'column',
						transform: 'perspective(1000px) rotateX(45deg) translateY(-200px) translateZ(-200px)'
					}
				}, 
				...tiles.map(row => {
					return createElement(
						'div',
						{},
						...row.map(tile => {
							return tile.floor
						})
					)
				})
			)
		),
		createElement(
			'div',
			{
				classes: [ 'panel' ]
			},
			createElement(
				'div',
				{},
				...towerButtons.map(({ deselectButton }) => {
					return deselectButton
				})
			),
			menuButtons
		)
	)
}