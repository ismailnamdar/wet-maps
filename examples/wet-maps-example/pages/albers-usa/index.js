
import React, { Component } from "react"
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
} from "../src"
import { scaleLinear } from "d3-scale"
import { csv } from 'd3-fetch'
import states from '../../static/states-albers-usa'
import {StyleSheet, Alert, View} from "react-native";

const colorScale = scaleLinear()
    .domain([500000,40000000])
    .range(["#FBE9E7","#FF5722"])

// TODO: CSV parse is not working
class AlbersUSA extends Component {
    constructor() {
        super()
        this.state = {
            population: [],
        }
    }
    componentDidMount() {
        csv('/static/population-albers-usa.csv')
            .then(population => {
                this.setState({ population })
            })
            .catch(err => Alert.alert("Error" + err));
    }
    render() {

        const { population } = this.state

        return (
            <View style={styles.container}>
                <ComposableMap
                    projection="albersUsa"
                    projectionConfig={{
                        scale: 1000,
                    }}
                    width={980}
                    height={551}
                    style={{
                        width: "100%",
                        height: "auto",
                    }}
                >
                    <ZoomableGroup disablePanning>
                        <Geographies geography={states} disableOptimization>
                            {(geographies, projection) =>
                                geographies.map((geography, i) => {
                                        const statePopulation = population.find(s =>
                                            s.name === geography.properties.NAME_1
                                        ) || {}
                                        return (
                                            <Geography
                                                key={`state-${geography.properties.ID_1}`}
                                                cacheId={`state-${geography.properties.ID_1}`}
                                                round
                                                geography={geography}
                                                projection={projection}
                                                style={{
                                                    default: {
                                                        fill: colorScale(+statePopulation.pop),
                                                        stroke: "#607D8B",
                                                        strokeWidth: 0.75,
                                                        outline: "none",
                                                    },
                                                    hover: {
                                                        fill: "#607D8B",
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
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        // maxHeight: 1000,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    }
});

export { AlbersUSA }
