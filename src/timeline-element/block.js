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

const { __ } = wp.i18n; // Import __() from wp.i18n
const { Component, Fragment } = wp.element;
const { InspectorControls, RichText, ColorPalette, MediaUpload, PlainText, InnerBlocks, getColorClass, getFontSizeClass, withColors,withFontSizes } = wp.editor;
const { RangeControl, PanelBody, BaseControl , SelectControl, Dashicon, Tooltip, Button, RadioControl } = wp.components;
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

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
registerBlockType( 'cgb/gostudy-timeline-element-block', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Timeline element' ), // Block title.
	icon: 'align-right', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'GSA', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Timeline element' )
	],
	parent: [ 'cgb/gostudy-timeline-block' ],
	attributes: {
		kicker: {
			type: 'string',
			default: '',
		},
		title: {
			type: 'string',
			default: '',
		},
		headerIcon: {
			type: 'string',
			default: 'plusCircleOutline',
		},
		headerIcon2: {
			type: 'string',
			default: 'plusCircleOutline',
		},
		imageAlt: {
			type: 'string'
		},
		imageUrl: {
			type: 'string'
		},
		alignement:{
			type: 'string',
			default: 'left'
		}

	},
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit({ attributes, className, setAttributes, focus }) {
		//const ALLOWED_BLOCKS = [ 'advgb/list', 'advgb/button', 'core/paragraph', 'cgb/gostudy-labeled-element' ];
		const ALLOWED_BLOCKS = [ 'advgb/list', 'advgb/button', 'core/paragraph', 'cgb/gostudy-strip-element-block', 'core/columns', 'core/heading', 'core/image' ];

		const {
			kicker,
			title,
			headerIcon,
			headerIcon2,
			imageAlt,
			imageSrc,
			alignement

		} = attributes;
		const getImageButton = (openEvent) => {
			if(attributes.imageUrl) {
			  return (
				<img
				  src={ attributes.imageUrl }
				  onClick={ openEvent }
				  className="image"
				/>
			  );
			}
			else {
			  return (
				<div className="button-container">
				  <Button
					onClick={ openEvent }
					className="button button-large"
				  >
					Pick an image
				  </Button>
				</div>
			  );
			}
		};
		let classes = 'gostudy-timeline-element-content row';
		if(attributes.alignement == 'right'){
			classes += ' align-right';
		}
		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={ __( 'Alignement' ) }>
						<RadioControl
								label="Image alignement"
								help=""
								selected={ alignement }
								options={ [

										{ label: 'Left', value: 'left' },
										{ label: 'Right', value: 'right' }
								] }
								onChange={ content => setAttributes({alignement : content || null }) }
						/>
						<label>
								<PlainText
									onChange={ content => setAttributes({ kicker: content || null }) }
									value={ attributes.kicker }
									placeholder="Timeline element kicker"
									className="label"
								/>
							</label>
							<h4 >

								<PlainText
								onChange={ content => setAttributes({ title: content || null }) }
								value={ attributes.title }
								placeholder="Timeline element title"
								className="heading"
							/>
							</h4>
					</PanelBody>
					<PanelBody title={ __( 'Content' ) }>
						<MediaUpload
							onSelect={ media => { setAttributes({ imageAlt: media.alt, imageUrl: media.url }); } }
							type="image"
							value={ attributes.imageID }
							render={ ({ open }) => getImageButton(open) }
						/>
						{attributes.imageUrl && attributes.imageUrl.length > 0 && <Button
							onClick={ media => { setAttributes({ imageAlt: null, imageUrl: null }); } }
							className="button button-large"
						>
							Remove image
						</Button>}
					</PanelBody>

					<PanelBody title={ __( 'Icon' ) }>
						<BaseControl label={ __( 'Icon Style' ) }>
							<div className="advgb-icon-items-wrapper">
								{Object.keys( ICONS ).map( ( key, index ) => (
									<div className="advgb-icon-item" key={ index }>
										<span className={ key === headerIcon2 ? 'active' : '' }
											onClick={ () => setAttributes( { headerIcon2: key || null} ) }>
												<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
													{ ICONS[key] }
												</svg>
										</span>
									</div>
								) ) }
							</div>
						</BaseControl>

					</PanelBody>

				</InspectorControls>
				<div className="container">
					<h5 className="text-light-gray">
						Timeline element
					</h5>
					<div className={classes} >
						<div className="col-5">
							<MediaUpload
								onSelect={ media => { setAttributes({ imageAlt: media.alt, imageUrl: media.url }); } }
								type="image"
								value={ attributes.imageID }
								render={ ({ open }) => getImageButton(open) }
							/>
							{attributes.imageUrl && attributes.imageUrl.length > 0 && <Button
								onClick={ media => { setAttributes({ imageAlt: null, imageUrl: null }); } }
								className="button button-large"
							>
								Remove image
							</Button>}
						</div>
						<div className="col-2">
							<div className="gostudy-timeline-element-icon">
								<svg fill="#000" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
									{ ICONS[headerIcon2] }
								</svg>
							</div>
						</div>
						<div className="col-5">

							<PlainText
									onChange={ content => setAttributes({ kicker: content || null }) }
									value={ attributes.kicker }
									placeholder="Timeline element kicker"
									className="label"
							/>
							<h4 >

								<PlainText
								onChange={ content => setAttributes({ title: content || null }) }
								value={ attributes.title }
								placeholder="Timeline element title"
								className="heading"
							/>
							</h4>
							<div className="bordered">
								<InnerBlocks allowedBlocks={ ALLOWED_BLOCKS }/>
							</div>
						</div>
					</div>

				</div>
			</Fragment>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save({ attributes }) {
	//save: function( { attributes } ) {

		if(attributes.headerIcon2 != "plusCircleOutline"){
			return(
				<Fragment>
				<svg fill="#000" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
					{ ICONS[attributes.headerIcon2] }
				</svg>
				<div className="timeline__body__childrens">
					<InnerBlocks.Content />
				</div>
				</Fragment>
			)
		}else{

			return (
				<div className="timeline__body__childrens">
					<InnerBlocks.Content />
				</div>
			);

		}

	},
} );
