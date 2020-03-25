import { debounce } from 'throttle-debounce'

const { __ } = wp.i18n
const { Component, Fragment } = wp.element
const { SelectControl, TextControl } = wp.components

export default class SelectPostTypeNCat extends Component {

  state = {
    results: false,
    currentType: 'Posts',
  }

  onSearch = debounce( 300, search => {

		if( search.length < 3) {
      return
    }

    this.setState( { results: __( 'Loading...' ) } )

    const collection = new wp.api.collections[this.state.currentType]()

    collection.fetch({
      data: {
        per_page: 20,
        search: search,
      },
    } )
    .then( results => {

      if(results.length == 0 ) {
        results = __( 'No result' )
      }
      this.setState( { results: results } )
    } )
  } )

  render() {

		const { results, currentType } = this.state

    return (
      <Fragment>

				<TextControl
					type="search"
					placeholder={ __( "Type a post title" ) }
					onChange={ value => this.onSearch( value ) }
				/>

        <div className="AGB-panel-results">

          { !! results && Array.isArray(results) ?
            (
              <ul>
                { results.map( result => {
                  return (
                    <li
                      key={result.id} 
                      onClick={ () => this.props.onChange( { id: result.id, type: currentType } ) }
                    >
                      { result.title.rendered }
                    </li>
                  )
                } ) }
              </ul>
            ) : (
              <p>{results}</p>
            )
          }
        </div>

				<SelectControl
					label={ __( 'Select post type' ) }
					options={ JSON.parse( gostudyAdminData.types ) }
					onChange={ value => this.setState( { currentType: value } ) }
				/>

			</Fragment>
    )
  }
}