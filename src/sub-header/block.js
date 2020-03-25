/**
 * BLOCK: gostudy-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { RichText, MediaUpload, PlainText, InnerBlocks } = wp.editor;
const { Button } = wp.components;
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

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
registerBlockType( 'cgb/gostudy-subheader-block', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Sub Header' ), // Block title.
	icon: 'shield', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Sub Header' )
	],
	attributes: {
		title: {
		  source: 'text',
		  selector: '.sub-header__title'
		},
		body: {
		  type: 'array',
		  source: 'children',
		  selector: '.sub-header__body'
		},
		imageAlt: {
		  attribute: 'alt',
		  selector: '.sub-header__image'
		},
		imageUrl: {
		  attribute: 'src',
		  selector: '.sub-header__image'
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
		//const ALLOWED_BLOCKS = [ 'advgb/list', 'cgb/gostudy-accordion-block', 'advgb/button', 'core/paragraph' ];
		const ALLOWED_BLOCKS = [ 'advgb/list', 'advgb/button', 'core/paragraph', 'cgb/gostudy-strip-element-block', 'core/columns', 'core/heading', 'core/image' ];
		const focusedEditable = focus ? focus.editable || 'title' : null;
		const onChangeIngredients = value => {
			setAttributes( { ingredients: value || null } );
		};
		const onFocusIngredients = focus => {
			setFocus( _.extend( {}, focus, { editable: 'ingredients' } ) );
		};
		// Creates a <p class='wp-block-cgb-block-gostudy-block'></p>.
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
		
		return (
			<div className="container">
				<h2 className="gutenberg-title">Sub header</h2>
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
				<h2>
					<PlainText
						onChange={ content => setAttributes({ title: content || null }) }
						value={ attributes.title }
						placeholder="Subheader title"
						className="heading"
					/>
				</h2>
				<div className="gutenberg-innerblocks">
					<InnerBlocks allowedBlocks={ ALLOWED_BLOCKS } />
				</div>
				
			</div>
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
		const renderImage = (src, alt) => {
			if(!src) return null;
		
			if(alt) {
			  return (
				<img 
				  className="sub-header__image" 
				  src={ src }
				  alt={ alt }
				/> 
			  );
			}
			
			// No alt set, so let's hide it from screen readers
			return (
			  <img 
				className="sub-header__image" 
				src={ src }
				alt=""
				aria-hidden="true"
			  /> 
			);
		};
		
		return (
			<div className="sub-header">
				{ renderImage(attributes.imageUrl, attributes.imageAlt) }
				<div className="sub-header__content">
					<h2 className="sub-header__title">{attributes.title}</h2>
					<div className="sub-header__body">
						<InnerBlocks.Content />
					</div>
					
				</div>
			</div>
		);
	},
} );

