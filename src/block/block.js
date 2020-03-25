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
registerBlockType( 'cgb/block-gostudy-block', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'gostudy-block - CGB Block' ), // Block title.
	icon: 'shield', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'gostudy-block — CGB Block' ),
		__( 'CGB Example' ),
		__( 'create-guten-block' ),
	],
	attributes: {
		title: {
		  source: 'text',
		  selector: '.card__title'
		},
		body: {
		  type: 'array',
		  source: 'children',
		  selector: '.card__body'
		},
		imageAlt: {
		  attribute: 'alt',
		  selector: '.card__image'
		},
		imageUrl: {
		  attribute: 'src',
		  selector: '.card__image'
		}
		,ingredients: {
			type: 'array',
			source: 'children',
			selector: '.ingredients',
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
				<PlainText
					onChange={ content => setAttributes({ title: content || null }) }
					value={ attributes.title }
					placeholder="Your card title"
					className="heading"
				/>
				<RichText
					onChange={ content => setAttributes({ body: content || null}) }
					value={ attributes.body }
					multiline="p"
					placeholder="Your card text"
				/>
				{ /* <RichText
					tagName="ul"
					multiline="li"
					placeholder={ __( 'Write a list of ingredients…' ) }
					value={ attributes.ingredients }
					onChange={ onChangeIngredients }
					focus={ focusedEditable === 'ingredients' }
					onFocus={ onFocusIngredients }
					className="ingredients"
				/> */}
				<div className="bordered">
					<InnerBlocks />
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
		const cardImage = (src, alt) => {
			if(!src) return null;
		
			if(alt) {
			  return (
				<img 
				  className="card__image" 
				  src={ src }
				  alt={ alt }
				/> 
			  );
			}
			
			// No alt set, so let's hide it from screen readers
			return (
			  <img 
				className="card__image" 
				src={ src }
				alt=""
				aria-hidden="true"
			  /> 
			);
		};
		return (
			<div className="card">
				{ cardImage(attributes.imageUrl, attributes.imageAlt) }
				<div className="card__content">
					<h3 className="card__title">{ attributes.title }</h3>
					<div className="card__body">
					{ attributes.body }
					</div>
					<div>
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	},
} );
