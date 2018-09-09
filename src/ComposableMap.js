
import React, { Component } from "react"
import Svg, { Defs, G, Rect } from "react-native-svg"

import projections from "./projections"
import defaultProjectionConfig from "./projectionConfig"

class ComposableMap extends Component {
    constructor() {
        super()
        this.projection = this.projection.bind(this)
    }
    projection() {
        const {
            projection,
            projectionConfig,
            width,
            height
        } = this.props

        // console.log(typeof projection);
        // console.log( projection !== "function" && projections(width, height, projectionConfig, projection));
        // console.log( projection === "function" && projection(width, height, projectionConfig));
        return typeof projection !== "function" ?
            projections(width, height, projectionConfig, projection) :
            projection(width, height, projectionConfig)
    }
    render() {

        const {
            width,
            height,
            style,
            className,
            showCenter,
            children,
            aspectRatio,
            viewBox,
            defs
        } = this.props

        return (
            <Svg width={ width }
                 height={ height }
                 maxWidth={'100%'}
                 maxHeight={'100%'}
                // TODO: Check whether this works (probably it works)
                 viewBox={ viewBox ? viewBox : `0 0 ${width} ${height}` }
                 className={ `rsm-svg ${className || ''}` }
                // TODO: Check if styling can be apply to svg
                 style={ style }
                // TODO: Check whether it works or not
                 preserveAspectRatio={ aspectRatio }>
                {
                    defs && (
                        // TODO: Check whether this works (probably it works)
                        <Defs>
                            {defs}
                        </Defs>
                    )
                }
                {
                    React.cloneElement(this.props.children, {
                        projection: this.projection(),
                        width,
                        height,
                    })
                }
                {
                    showCenter && (
                        // TODO: Check whether this works (probably it works)
                        <G>
                            <Rect x={width/2-0.5} y={0} width={ 1 } height={ height } fill="#e91e63" />
                            <rect x={0} y={height/2-0.5} width={ width } height={ 1 } fill="#e91e63" />
                        </G>
                    )
                }
            </Svg>
        )
    }
}

ComposableMap.defaultProps = {
    width: 800,
    height: 450,
    projection: "times",
    projectionConfig: defaultProjectionConfig,
    aspectRatio: "xMidYMid",
    viewBox: null
}

export default ComposableMap

//maxWidth={'100%'}
// height={125}
// maxHeight={'100%'}
//          display: 'inline-block', // This is default in RN no?
// fill: 'currentcolor', // If you wrap your content in a G element, you can set fill for all ancestors to inherit it
// height: '1.25em', // RN doesn't support em in sizing their elements, can use pixels instead (and soon percentages in the root svg element of rnsvg as well)
//   maxWidth: '100%', // RN already support this on the root svg element no?
// position: 'relative', // This is default for RN right?
// userSelect: 'none', // Nothing is selectable by default in RN anyway, or?
// textAlignVertical: 'text-bottom'
