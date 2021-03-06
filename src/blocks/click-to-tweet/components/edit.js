/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import applyWithColors from './colors';
import ClickToTweet from './click-to-tweet';
import FONT_SIZES from './font-sizes';
import Inspector from './inspector';
import Controls from './controls';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { compose } = wp.compose;
const { RichText } = wp.editor;
const { withSelect } = wp.data;

/**
 * Block constants
 */
const applyWithSelect = withSelect( ( select ) => {
	const { getPermalink } = select( 'core/editor' );

	return {
		postLink: getPermalink(),
	};
} );

/**
 * Block edit function
 */
export default compose( applyWithSelect, applyWithColors ) ( class Edit extends Component {

	constructor() {
		super( ...arguments );
		this.getFontSize = this.getFontSize.bind( this );
	}

	componentWillReceiveProps( { postLink } ) {
		if ( postLink ) {
			this.props.setAttributes( {
				url: postLink
			} );
		}
	}

	getFontSize() {
		const { customFontSize, fontSize } = this.props.attributes;

		if ( fontSize ) {
			const fontSizeObj = find( FONT_SIZES, { name: fontSize } );
			if ( fontSizeObj ) {
				return fontSizeObj.size;
			}
		}

		if ( customFontSize ) {
			return customFontSize;
		}
	}

	render() {
		const {
			attributes,
			buttonColor,
			className,
			isSelected,
			setAttributes,
			setButtonColor,
			setTextColor,
			textColor,
			fallbackButtonColor,
			fallbackTextColor,
			fallbackFontSize,
		} = this.props;

		const {
			buttonText,
			content,
			url,
			via,
		} = attributes;

		const fontSize = this.getFontSize();

		return [
			<Fragment>
				{ isSelected && (
					<Controls
						{ ...this.props }
					/>
				) }
				{ isSelected && (
					<Inspector
						{ ...this.props }
					/>
				) }
				<ClickToTweet { ...this.props }>
					<RichText
						tagName="p"
						multiline="false"
						placeholder={ __( 'Add a quote to tweet...' ) }
						value={ content }
						formattingControls={ [] }
						className={ classnames(
							`${ className }__text`, {
								'has-text-color': textColor.value,
								[ textColor.class ]: textColor.class,
							}
						) }
						style={ {
							color: textColor.value,
							fontSize: fontSize ? fontSize + 'px' : undefined,
						} }
						onChange={ ( nextContent ) => setAttributes( { content: nextContent } ) }
						keepPlaceholderOnFocus
					/>

					<RichText
						tagName="span"
						multiline="false"
						placeholder={ __( 'Add button...' ) }
						value={ buttonText }
						formattingControls={ [] }
						className={ classnames(
							`${ className }__twitter-btn`, {
								'has-button-color': buttonColor.value,
								[ buttonColor.class ]: buttonColor.class,
							}
						) }
						style={ {
							backgroundColor: buttonColor.value,
						} }
						onChange={ ( nextButtonText ) => setAttributes( { buttonText: nextButtonText } ) }
						keepPlaceholderOnFocus
					/>
				</ClickToTweet>
			</Fragment>
		];
	}
} );