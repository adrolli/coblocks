/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import applyWithColors from './colors';
import Controls from './controls';
import Highlighter from './highlight';
import Inspector from './inspector';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { compose } = wp.compose;
const { RichText } = wp.editor;
const { createBlock } = wp.blocks;

/**
 * Block edit function
 */
export default compose( applyWithColors ) ( class Edit extends Component {

	constructor( props ) {
		super( ...arguments );
		this.splitBlock = this.splitBlock.bind( this );
	}

	/**
	 * Split handler for RichText value, namely when content is pasted or the
	 * user presses the Enter key.
	 *
	 * @param {?Array}     before Optional before value, to be used as content
	 *                            in place of what exists currently for the
	 *                            block. If undefined, the block is deleted.
	 * @param {?Array}     after  Optional after value, to be appended in a new
	 *                            paragraph block to the set of blocks passed
	 *                            as spread.
	 * @param {...WPBlock} blocks Optional blocks inserted between the before
	 *                            and after value blocks.
	 */
	splitBlock( before, after, ...blocks ) {
		const {
			attributes,
			insertBlocksAfter,
			setAttributes,
			onReplace,
		} = this.props;

		if ( after ) {
			// Append "After" content as a new paragraph block to the end of
			// any other blocks being inserted after the current paragraph.
			blocks.push( createBlock( 'core/paragraph', { content: after } ) );
		}

		if ( blocks.length && insertBlocksAfter ) {
			insertBlocksAfter( blocks );
		}

		const { content } = attributes;

		if ( ! before ) {
			// If before content is omitted, treat as intent to delete block.
			onReplace( [] );
		} else if ( content !== before ) {
			// Only update content if it has in-fact changed. In case that user
			// has created a new paragraph at end of an existing one, the value
			// of before will be strictly equal to the current content.
			setAttributes( { content: before } );
		}
	}

	render() {

		const {
			attributes,
			backgroundColor,
			className,
			insertBlocksAfter,
			isSelected,
			mergeBlocks,
			onReplace,
			setAttributes,
			setBackgroundColor,
			setTextColor,
			textColor,
		} = this.props;

		const {
			content,
		} = attributes;

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
				<Highlighter { ...this.props }>
					<RichText
						tagName="mark"
						placeholder={ __( 'Add highlighted text...' ) }
						value={ content }
						onChange={ ( value ) => setAttributes( { content: value } ) }
						onMerge={ mergeBlocks }
						onSplit={ this.splitBlock }
						onRemove={ () => onReplace( [] ) }
						className={ classnames(
							`${ className }__content`, {
								'has-background': backgroundColor.value,
								[ backgroundColor.class ]: backgroundColor.class,
								'has-text-color': textColor.value,
								[ textColor.class ]: textColor.class,
							}
						) }
						style={ {
								backgroundColor: backgroundColor.value,
								color: textColor.value,
							} }
						keepPlaceholderOnFocus
					/>
				</Highlighter>
			</Fragment>
		];
	}
} );
