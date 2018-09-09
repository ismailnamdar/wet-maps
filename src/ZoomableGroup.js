
import React, { Component } from "react"
import { geoPath } from "d3-geo"
import { PanResponder } from 'react-native'
import { G, Rect } from "react-native-svg"

import {
    calculateResizeFactor,
    calculateMousePosition,
    createNewChildren,
    computeBackdrop,
} from "./utils"

class ZoomableGroup extends Component {
    constructor(props) {
        super(props)

        const backdrop = computeBackdrop(props.projection, props.backdrop)

        this.state = {
            mouseX: calculateMousePosition("x", props.projection, props, props.zoom, 1),
            mouseY: calculateMousePosition("y", props.projection, props, props.zoom, 1),
            mouseXStart: 0,
            mouseYStart: 0,
            isPressed: false,
            resizeFactorX: 1,
            resizeFactorY: 1,
            backdrop: {
                width: Math.round(backdrop.width),
                height: Math.round(backdrop.height),
                x: Math.round(backdrop.x),
                y: Math.round(backdrop.y),
            },
        }

        // this.handleMouseMove = this.handleMouseMove.bind(this)
        // this.handleMouseUp = this.handleMouseUp.bind(this)
        // this.handleMouseDown = this.handleMouseDown.bind(this)
        // this.handleTouchStart = this.handleTouchStart.bind(this)
        // this.handleTouchMove = this.handleTouchMove.bind(this)
        // this.handleResize = this.handleResize.bind(this)

    }
    handleMouseMove({ pageX, pageY }) {
        if (this.props.disablePanning) return
        if (!this.state.isPressed) return
        this.setState({
            mouseX: pageX - this.state.mouseXStart,
            mouseY: pageY - this.state.mouseYStart,
        })
    }
    handleTouchMove({ touches }) {
        this.handleMouseMove(touches[0])
    }
    handleMouseUp() {
        if (this.props.disablePanning) return
        if (!this.state.isPressed) return
        this.setState({
            isPressed: false,
        })
        if (!this.props.onMoveEnd) return
        const { mouseX, mouseY, resizeFactorX, resizeFactorY } = this.state
        const { zoom, width, height, projection, onMoveEnd } = this.props
        const x = width / 2 - (mouseX * resizeFactorX / zoom)
        const y = height / 2 - (mouseY * resizeFactorY / zoom)
        const newCenter = projection.invert([ x, y ])
        onMoveEnd(newCenter)
    }
    handleMouseDown({ pageX, pageY }) {
        if (this.props.disablePanning) return
        const { mouseX, mouseY, resizeFactorX, resizeFactorY } = this.state
        const { zoom, width, height, projection, onMoveStart } = this.props
        this.setState({
            isPressed: true,
            mouseXStart: pageX - mouseX,
            mouseYStart: pageY - mouseY,
        })
        if (!onMoveStart) return
        const x = width / 2 - (mouseX * resizeFactorX / zoom)
        const y = height / 2 - (mouseY * resizeFactorY / zoom)
        const currentCenter = projection.invert([ x, y ])
        onMoveStart(currentCenter)
    }
    handleTouchStart({ touches }) {
        if (touches.length > 1) {
            this.handleMouseDown(touches[0])
        }
        else {
            this.handleMouseUp()
        }
    }
    preventTouchScroll(evt) {
        if (evt.touches.length > 1) {
            evt.preventDefault()
        }
    }
    componentWillReceiveProps(nextProps) {
        const { mouseX, mouseY, resizeFactorX, resizeFactorY } = this.state
        const { projection, center, zoom } = this.props

        const zoomFactor = nextProps.zoom / zoom
        const centerChanged = JSON.stringify(nextProps.center) !== JSON.stringify(center)

        this.setState({
            zoom: nextProps.zoom,
            mouseX: centerChanged ? calculateMousePosition("x", nextProps.projection, nextProps, nextProps.zoom, resizeFactorX) : mouseX * zoomFactor,
            mouseY: centerChanged ? calculateMousePosition("y", nextProps.projection, nextProps, nextProps.zoom, resizeFactorY) : mouseY * zoomFactor,
        })
    }
    handleResize() {
        const { width, height, projection, zoom } = this.props

        const resizeFactorX = calculateResizeFactor(this.zoomableGroupNode.parentNode.getBoundingClientRect().width, width)
        const resizeFactorY = calculateResizeFactor(this.zoomableGroupNode.parentNode.getBoundingClientRect().height, height)

        const xPercentageChange = 1 / resizeFactorX * this.state.resizeFactorX
        const yPercentageChange = 1 / resizeFactorY * this.state.resizeFactorY

        this.setState({
            resizeFactorX: resizeFactorX,
            resizeFactorY: resizeFactorY,
            mouseX: this.state.mouseX * xPercentageChange,
            mouseY: this.state.mouseY * yPercentageChange,
        })
    }
    componentWillMount() {
        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            // onStartShouldSetPanResponder: (evt, gestureState) => true,
            // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                console.log("evt: ", evt, " gestureState: ", gestureState);
                if(gestureState.moveX !== this.state.mouseX || gestureState.moveY !== this.state.mouseY) {
                    return true
                }
                return false
            },
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                // console.log("onPanResponderGrant")
                //   console.log("onPanResponderGrant", " evt: ", evt, " state: ", gestureState)
                // The gesture has started. Show visual feedback so the user knows
                // what is happening!
                console.log("gesture", gestureState)
                if (gestureState.numberActiveTouches > 1) {
                    return
                }
                // gestureState.d{x,y} will be set to zero now
                if (this.props.disablePanning) return
                this.setState({
                    isPressed: true,
                    mouseXStart: gestureState.moveX,
                    mouseYStart: gestureState.moveY,
                })
                if (!this.props.onMoveStart) return
                const currentCenter = this.props.projection.invert([this.props.width/2,this.props.height/2])
                this.props.onMoveStart(currentCenter)
            },
            onPanResponderMove: (evt, gestureState) => {
                // console.log("evt:", evt.nativeEvent.pageX);
                // console.log("onPanResponderMove", " evt: ", evt, " state: ", gestureState)
                // if (!this.props.onMoveStart) return
                // const currentCenter = this.props.projection.invert([this.props.width/2,this.props.height/2])
                // this.props.onMoveStart(currentCenter)
                if(gestureState.moveX === this.state.mouseX || gestureState.moveY === this.state.mouseY) {
                    return
                }
                console.log("activetouches", gestureState.numberActiveTouches)
                if (this.props.disablePanning) return
                if (gestureState.numberActiveTouches > 1) return

                const differenceX = gestureState.moveX - this.state.mouseXStart
                const differenceY = gestureState.moveY - this.state.mouseYStart

                this.setState({
                    isPressed: true,
                    mouseX: gestureState.moveX,
                    mouseY: gestureState.moveY,
                    mouseXStart: gestureState.moveX,
                    mouseYStart: gestureState.moveY,
                    rotation: [
                        this.state.rotation[0] + (differenceX * this.props.sensitivity),
                        this.state.rotation[1] - (differenceY * this.props.sensitivity),
                        this.state.rotation[2],
                    ],
                })
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // console.log("onPanResponderRelease", " evt: ", evt, " state: ", gestureState)
                // The user has released all touches while this view is the
                // responder. This typically means a gesture has succeeded
                if (this.props.disablePanning) return
                if (!this.state.isPressed) return
                this.setState({
                    isPressed: false,
                })
                if (!this.props.onMoveEnd) return
                const newCenter = this.props.projection.invert([this.props.width/2,this.props.height/2])
                this.props.onMoveEnd(newCenter)
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // console.log("onPanResponderTerminate")
                // console.log("onPanResponderTerminate", " evt: ", evt, " state: ", gestureState)
                // Another component has become the responder, so this gesture
                // should be cancelled
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // console.log("onShouldBlockNativeResponder")
                // console.log("onShouldBlockNativeResponder", " evt: ", evt, " state: ", gestureState)
                // Returns whether this component should block native components from becoming the JS
                // responder. Returns true by default. Is currently only supported on android.
                return true;
            },
        });
    }
    // componentDidMount() {
    //     // Added parentWidth and parentHeight
    //     const { parentWidth, parentHeight, width, height, projection, zoom } = this.props
    //
    //     const resizeFactorX = calculateResizeFactor(parentWidth, width)
    //     const resizeFactorY = calculateResizeFactor(parentHeight, height)
    //
    //     this.setState({
    //         resizeFactorX: resizeFactorX,
    //         resizeFactorY: resizeFactorY,
    //         mouseX: calculateMousePosition("x", projection, this.props, zoom, resizeFactorX),
    //         mouseY: calculateMousePosition("y", projection, this.props, zoom, resizeFactorY),
    //     })
    //
    //     // window.addEventListener("resize", this.handleResize)
    //     // window.addEventListener("mouseup", this.handleMouseUp)
    //     // this.zoomableGroupNode.addEventListener("touchmove", this.preventTouchScroll)
    // }
    // componentWillUnmount() {
    //     window.removeEventListener("resize", this.handleResize)
    //     window.removeEventListener("mouseup", this.handleMouseUp)
    //     this.zoomableGroupNode.removeEventListener("touchmove", this.preventTouchScroll)
    // }
    render() {
        const {
            width,
            height,
            zoom,
            style,
            projection,
            children,
            center,
        } = this.props

        const {
            mouseX,
            mouseY,
            resizeFactorX,
            resizeFactorY,
        } = this.state
        console.log("state: ", this.state);
        console.log("props: ", this.props);

        console.log("x: ", Math.round((width / 2 + resizeFactorX * mouseX) * 100) / 100);
        console.log("y: ", Math.round((height / 2 + resizeFactorY * mouseY) * 100) / 100);
        return (
            // TODO: Check what classNAme does
            <G className="rsm-zoomable-group"
                ref={ zoomableGroupNode => this.zoomableGroupNode = zoomableGroupNode }
                // TODO: Check transform correct usage
               transform={`
                   translate(
                     ${ Math.round((width / 2 + resizeFactorX * mouseX) * 100) / 100 }
                     ${ Math.round((height / 2 + resizeFactorY * mouseY) * 100) / 100 }
                   )
                   scale(${ zoom })
                   translate(${ -width / 2 } ${ -height / 2 })
                 `}
                // TODO: Implement touch event and zooming
               {...this._panResponder.panHandlers}
                // TODO: Check whether styling can be applied
               style={ style }
            >
                <Rect
                    x={ this.state.backdrop.x }
                    y={ this.state.backdrop.y }
                    width={ this.state.backdrop.width }
                    height={ this.state.backdrop.height }
                    fill="transparent"
                    strokeWidth={"0"}
                />
                { createNewChildren(children, this.props) }
            </G>
        )
    }
}

ZoomableGroup.defaultProps = {
    center: [ 0, 0 ],
    backdrop: {
        x: [-179.9, 179.9],
        y: [89.9, -89.9],
    },
    zoom: 1,
    disablePanning: false,
}

export default ZoomableGroup
