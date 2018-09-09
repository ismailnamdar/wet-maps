
import React, { Component } from "react"
import { geoPath } from "d3-geo"
import { PanResponder, Animated } from "react-native"

import { createNewChildren } from "./utils"
import { G } from 'react-native-svg';

class ZoomableGlobe extends Component {
  constructor(props) {
    super(props)

    const initialRotation = props.projection.rotate()
    console.log("initialRotation: ", initialRotation)
    this.state = {
      pan: new Animated.ValueXY(),
      mouseX: 0,
      mouseY: 0,
      mouseXStart: 0,
      mouseYStart: 0,
      isPressed: false,
      rotation: [
        initialRotation[0] - props.center[0],
        initialRotation[1] - props.center[1],
        initialRotation[2],
      ],
    }

    // this.handleMouseMove = this.handleMouseMove.bind(this)
    // this.handleMouseUp = this.handleMouseUp.bind(this)
    // this.handleMouseDown = this.handleMouseDown.bind(this)
    // this.handleTouchStart = this.handleTouchStart.bind(this)
    // this.handleTouchMove = this.handleTouchMove.bind(this)
  }
  handleMouseMove({ pageX, pageY, clientX, clientY }) {
    if (this.props.disablePanning) return
    if (!this.state.isPressed) return

    const differenceX = clientX - this.state.mouseXStart
    const differenceY = clientY - this.state.mouseYStart

    this.setState({
      mouseX: clientX,
      mouseY: clientY,
      mouseXStart: clientX,
      mouseYStart: clientY,
      rotation: [
        this.state.rotation[0] + (differenceX * this.props.sensitivity),
        this.state.rotation[1] - (differenceY * this.props.sensitivity),
        this.state.rotation[2],
      ],
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
    const newCenter = this.props.projection.invert([this.props.width/2,this.props.height/2])
    this.props.onMoveEnd(newCenter)
  }
  handleMouseDown({ pageX, pageY, clientX, clientY }) {
    if (this.props.disablePanning) return
    this.setState({
      isPressed: true,
      mouseXStart: clientX,
      mouseYStart: clientY,
    })
    if (!this.props.onMoveStart) return
    const currentCenter = this.props.projection.invert([this.props.width/2,this.props.height/2])
    this.props.onMoveStart(currentCenter)
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
    const { mouseX, mouseY } = this.state
    const { projection, center, zoom } = this.props

    const zoomFactor = nextProps.zoom / zoom
    const centerChanged = JSON.stringify(nextProps.center) !== JSON.stringify(center)

    this.setState({
      zoom: nextProps.zoom,
      rotation: centerChanged ? [-nextProps.center[0], -nextProps.center[1], this.state.rotation[2]] : this.state.rotation,
    })
  }
  componentDidMount() {
    const { width, height, projection, zoom } = this.props

    // window.addEventListener("resize", this.handleResize)
    // window.addEventListener("mouseup", this.handleMouseUp)
    // this.zoomableGlobeNode.addEventListener("touchmove", this.preventTouchScroll)
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
  componentWillUnmount() {
    // window.removeEventListener("resize", this.handleResize)
    // window.removeEventListener("mouseup", this.handleMouseUp)
    // this.zoomableGlobeNode.removeEventListener("touchmove", this.preventTouchScroll)
  }
  render() {
    const {
      width,
      height,
      zoom,
      style,
      projection,
      children,
    } = this.props

    const {
      mouseX,
      mouseY,
    } = this.state

    console.log("ZoomableGlobe Rebder")
    return (
      <G className="rsm-zoomable-globe"
         ref={ zoomableGlobeNode => this.zoomableGlobeNode = zoomableGlobeNode }
         transform={{
             translate: `${ width / 2 } ${ height / 2 }`,
             scale: `${ zoom }`,
             translate: `${ -width / 2 }, ${ -height / 2 }`
         }}
         {...this._panResponder.panHandlers}
         // transform={`
         //   translate(${ width / 2 } ${ height / 2 })
         //   scale(${ zoom })
         //   translate(${ -width / 2 } ${ -height / 2 })
         // `}
         // onMouseMove={ this.handleMouseMove }
         // onMouseUp={ this.handleMouseUp }
         // onMouseDown={ this.handleMouseDown }
         // onTouchStart={ this.handleTouchStart }
         // onTouchMove={ this.handleTouchMove }
         // onTouchEnd={ this.handleMouseUp }
         style={ style }
      >
        { createNewChildren(children, {
            width,
            height,
            center: this.center,
            backdrop: this.backdrop,
            zoom: this.props.zoom,
            disablePanning: this.props.disablePanning,
            children,
            projection: projection.rotate(this.state.rotation),
          }) }
      </G>
    )
  }
}

ZoomableGlobe.defaultProps = {
  center: [ 0, 0 ],
  zoom: 1,
  disablePanning: false,
  sensitivity: 1,
}

export default ZoomableGlobe
