/**
 * BLOCK: gostudy-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';
import ICONS from '../icons.js';


import React from 'react';
import classnames from 'classnames';
const { __ } = wp.i18n;;
const { Component, Fragment } = wp.element;
const { registerBlockType } = wp.blocks;
const { InspectorControls, RichText, ColorPalette, MediaUpload, PlainText, InnerBlocks, getColorClass, getFontSizeClass, withColors,withFontSizes,PanelColorSettings } = wp.editor;
const { RangeControl, PanelBody, BaseControl , SelectControl, Dashicon, Tooltip } = wp.components;



class GridLinks extends React.Component {
	constructor() {
			super( ...arguments );
			this.state = {
					currentAccordion: null,
			}
	}

	componentDidMount() {
			this.initAccordion();
	}

	componentDidUpdate( prevProps ) {
			if ( prevProps.attributes.items.length < this.props.attributes.items.length ) {
					this.initAccordion( true );
			}
	}

	initAccordion( refresh = false ) {
			if (typeof jQuery !== "undefined") {
					if (!refresh) {
							jQuery( `#block-${this.props.id} .advgb-accordion-block` ).accordion( {
									header: ".advgb-accordion-header",
									heightStyle: "content",
							} );
					} else {
							jQuery(`#block-${this.props.id} .advgb-accordion-block`).accordion('refresh');
					}

					jQuery(`#block-${this.props.id} .advgb-accordion-block h4`).on( 'keydown', function ( e ) {
							e.stopPropagation();
					} )
			}
	}

	updateAccordion( value, index ) {
			const { attributes, setAttributes } = this.props;
			const { items } = attributes;

			let newItems = items.map( ( item, thisIndex ) => {
					if ( index === thisIndex ) {
							if (value.body) {
									if (value.body.length !== item.body.length) {
											this.initAccordion( true );
									}
							}

							item = { ...item, ...value };
					}

					return item;
			} );

			setAttributes( { items: newItems } )
	}

	render() {
			const { isSelected, attributes, setAttributes } = this.props;
			const {
					items,
					headerBgColor,
					headerTextColor,
					headerIcon,
					headerIconColor,
					bodyBgColor,
					bodyTextColor,
					borderStyle,
					borderWidth,
					borderColor,
					borderRadius,
			} = attributes;

			return (
					<Fragment>
							<InspectorControls>
									<PanelBody title={ __( 'Header Settings' ) }>
											<PanelColorSettings title={ __( 'Background Color' ) } colorValue={ headerBgColor || 'transparent' } initialOpen={ false }>
													<ColorPalette
															value={ headerBgColor }
															onChange={ ( value ) => setAttributes( { headerBgColor: value || 'transparent' } ) }
													/>
											</PanelColorSettings>
											<PanelColorSettings title={ __( 'Text Color' ) } colorValue={ headerTextColor || 'transparent' } initialOpen={ false }>
													<ColorPalette
															value={ headerTextColor }
															onChange={ ( value ) => setAttributes( { headerTextColor: value || 'transparent' } ) }
													/>
											</PanelColorSettings>
											<PanelBody title={ __( 'Header Icon' ) }>
													<BaseControl label={ __( 'Icon Style' ) }>
															<div className="advgb-icon-items-wrapper">
																	{Object.keys( ICONS ).map( ( key, index ) => (
																			<div className="advgb-icon-item" key={ index }>
																					<span className={ key === headerIcon ? 'active' : '' }
																								onClick={ () => setAttributes( { headerIcon: key || null } ) }>
																							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
																									{ ICONS[key] }
																							</svg>
																					</span>
																			</div>
																	) ) }
															</div>
													</BaseControl>
													<PanelColorSettings title={ __( 'Icon Color' ) } colorValue={ headerIconColor } initialOpen={ false }>
															<ColorPalette
																	value={ headerIconColor }
																	onChange={ ( value ) => setAttributes( { headerIconColor: value || 'transparent'} ) }
															/>
													</PanelColorSettings>
											</PanelBody>
									</PanelBody>
									<PanelBody title={ __( 'Body Settings' ) } initialOpen={ false }>
											<PanelColorSettings title={ __( 'Background Color' ) } colorValue={ bodyBgColor } initialOpen={ false }>
													<ColorPalette
															value={ bodyBgColor }
															onChange={ ( value ) => setAttributes( { bodyBgColor: value || 'transparent' } ) }
													/>
											</PanelColorSettings>
											<PanelColorSettings title={ __( 'Text Color' ) } colorValue={ bodyTextColor } initialOpen={ false }>
													<ColorPalette
															value={ bodyTextColor }
															onChange={ ( value ) => setAttributes( { bodyTextColor: value || 'transparent' } ) }
													/>
											</PanelColorSettings>
									</PanelBody>
									<PanelBody title={ __( 'Border Settings' ) } initialOpen={ false }>
											<SelectControl
													label={ __( 'Border Style' ) }
													value={ borderStyle }
													options={ [
															{ label: __( 'Solid' ), value: 'solid' },
															{ label: __( 'Dashed' ), value: 'dashed' },
															{ label: __( 'Dotted' ), value: 'dotted' },
													] }
													onChange={ ( value ) => setAttributes( { borderStyle: value || null } ) }
											/>
											<PanelColorSettings title={ __( 'Border Color' ) } colorValue={ borderColor } initialOpen={ false }>
													<ColorPalette
															value={ borderColor }
															onChange={ ( value ) => setAttributes( { borderColor: value || 'transparent' } ) }
													/>
											</PanelColorSettings>
											<RangeControl
													label={ __( 'Border width' ) }
													value={ borderWidth }
													min={ 1 }
													max={ 10 }
													onChange={ ( value ) => setAttributes( { borderWidth: value || null } ) }
											/>
											<RangeControl
													label={ __( 'Border radius' ) }
													value={ borderRadius }
													min={ 0 }
													max={ 100 }
													onChange={ ( value ) => setAttributes( { borderRadius: value || null } ) }
											/>
									</PanelBody>
							</InspectorControls>
							<div className="advgb-accordion-block">
									{items.map( ( item, index ) => (
											<Fragment key={ index }>
													<div className="advgb-accordion-header"

															 style={ {
																	 backgroundColor: headerBgColor,
																	 color: headerTextColor,
																	 borderStyle: borderStyle,
																	 borderWidth: borderWidth + 'px',
																	 borderColor: borderColor,
																	 borderRadius: borderRadius + 'px',
															 } }
													>
															<Tooltip text={ __( 'Remove item' ) }>
																	<span className="advgb-accordion-remove"
																				onClick={ () => setAttributes( { items: items.filter( ( cItem, cIndex) => cIndex !== index ) } ) }
																	>
																			<Dashicon icon="no"/>
																	</span>
															</Tooltip>
															<span className="advgb-accordion-header-icon">
																	<svg fill={ headerIconColor } xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
																			{ ICONS[headerIcon] }
																	</svg>
															</span>
															<RichText
																	tagName="h4"
																	value={ item.header }
																	onChange={ ( value ) => this.updateAccordion( { header: value }, index ) }
																	onSplit={ () => null }
																	placeholder={ __( 'Enter header…' ) }
															/>
													</div>
													<div className="advgb-accordion-body"
															 style={ {
																	 backgroundColor: bodyBgColor,
																	 color: bodyTextColor,
																	 borderStyle: borderStyle,
																	 borderWidth: borderWidth + 'px',
																	 borderColor: borderColor,
																	 borderRadius: borderRadius + 'px',
															 } }
													>	
															<RichText
																	tagName="p"
																	value={ item.body }
																	onChange={ ( value ) => this.updateAccordion( { body: value }, index ) }
																	placeholder={ __( 'Enter text…' ) }
															/>
													</div>
											</Fragment>
									) ) }
							</div>
							{isSelected &&
									<div className="advgb-accordion-controls">
											<button className="button button-large button-primary"
															onClick={ () => setAttributes( {
																	items: [
																			...items,
																			{ header: __( 'New item' ), body: __( 'New item' ) }
																	]
															} ) }
											>
													{ __( 'Add item' ) }
											</button>
									</div>
							}
					</Fragment>
			)
	}
}

const accordionBlockIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="2 2 22 22">
			<path fill="none" d="M0,0h24v24H0V0z"/>
			<rect x="3" y="17" width="18" height="2"/>
			<path d="M19,12v1H5v-1H19 M21,10H3v5h18V10L21,10z"/>
			<rect x="3" y="6" width="18" height="2"/>
	</svg>
);

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'cgb/gostudy-gridlinks-block', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Grid Links' ), // Block title.
	icon: accordionBlockIcon, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'formatting', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Grid Links' )
	],
	attributes: {
		items: {
				type: 'array',
				default: [
						{
							link: '#',
							body: 'link 1',
						},
						{
							link: '#',
							body: 'link 2',
						},
						{
							link: '#',
							body: 'link 3',
						},
				]
		},
		accentColor: {
				type: 'string',
				default: '#007380',
		},
		bgColor: {
				type: 'string',
				default: '#007380',
		},
		headerIcon: {
				type: 'string',
				default: 'plusCircleOutline',
		}
		
},
edit: GridLinks,
save: function ( { attributes } ) {
		const {
				items,
				headerBgColor,
				headerTextColor,
				headerIcon,
				headerIconColor,
				bodyBgColor,
				bodyTextColor,
				borderStyle,
				borderWidth,
				borderColor,
				borderRadius,
		} = attributes;

		return (
				<div className="advgb-accordion-block">
						{items.map( ( item, index ) => (
								<Fragment key={ index }>
										<div className="advgb-accordion-header"
												 style={ {
														 backgroundColor: headerBgColor,
														 color: headerTextColor,
														 borderStyle: borderStyle,
														 borderWidth: borderWidth + 'px',
														 borderColor: borderColor,
														 borderRadius: borderRadius + 'px',
												 } }
										>
												<span className="advgb-accordion-header-icon">
														<svg fill={ headerIconColor } xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
																{ ICONS[headerIcon] }
														</svg>
												</span>
												<h4 className="advgb-accordion-header-title">{ item.header }</h4>
										</div>
										<div className="advgb-accordion-body"
												 style={ {
														 backgroundColor: bodyBgColor,
														 color: bodyTextColor,
														 borderStyle: borderStyle,
														 borderWidth: borderWidth + 'px',
														 borderColor: borderColor,
														 borderRadius: borderRadius + 'px',
												 } }
										>
												<RichText.Content tagName="p" value={ item.body }/>
										</div>
								</Fragment>
						) ) }
				</div>
		);
},
} );

