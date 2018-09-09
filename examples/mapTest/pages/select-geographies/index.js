
import React, { Component } from "react"
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
} from "../../src"
import {StyleSheet, View, Text} from "react-native"
import world from '../../static/world-50m-simplified'

const tagStyles = {
    display: "flex",
    background: "#ECEFF1",
    // padding: "0.25rem 0.5rem",
    // margin: "0 0.125rem 0.125rem 0",
}

class SelectGeographies extends Component {
    constructor() {
        super()
        this.state = {
            selected: [],
        }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(geo) {
        const isSelected = this.state.selected.indexOf(geo.properties.ISO_A3) !== -1
        this.setState({
            selected: isSelected
                ? this.state.selected.reduce((acc, cur) => {
                    if (geo.properties.ISO_A3 !== cur) acc.push(cur)
                    return acc
                }, [])
                : this.state.selected.concat([geo.properties.ISO_A3])
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <ComposableMap
                    projectionConfig={{ scale: 205 }}
                    width={980}
                    height={551}
                    style={{
                        width: "100%",
                        height: "auto",
                    }}
                >
                    <ZoomableGroup>
                        <Geographies geography={world} disableOptimization>
                            {(geos, proj) =>
                                geos.map((geo, i) => {

                                        const isSelected = this.state.selected.indexOf(geo.properties.ISO_A3) !== -1

                                        return (
                                            <Geography
                                                key={geo.properties.ISO_A3 + i}
                                                cacheId={geo.properties.ISO_A3 + i}
                                                geography={geo}
                                                projection={proj}
                                                onClick={this.handleClick}
                                                style={{
                                                    default: {
                                                        fill: isSelected ? "#FF5722" : "#ECEFF1",
                                                        stroke: "#607D8B",
                                                        strokeWidth: 0.75,
                                                        outline: "none",
                                                    },
                                                    hover: {
                                                        fill: isSelected ? "#E64A19" : "#607D8B",
                                                        stroke: "#607D8B",
                                                        strokeWidth: 0.75,
                                                        outline: "none",
                                                    },
                                                    pressed: {
                                                        fill: "#FF5722",
                                                        stroke: "#607D8B",
                                                        strokeWidth: 0.75,
                                                        outline: "none",
                                                    },
                                                }}
                                            />
                                        )
                                    }
                                )}
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>
                <View>
                    {
                        this.state.selected.length > 0
                            ?
                            this.state.selected.map(item =>
                                <Text key={item} style={tagStyles}>
                                    { item }
                                </Text>
                            )
                            :
                            <Text>
                                {/*<Text style={{ padding: "0.25rem 0.5rem" }}>*/}
                                { "No countries selected." }
                            </Text>
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        fontFamily: "Roboto, sans-serif",
    },
});

export { SelectGeographies }
