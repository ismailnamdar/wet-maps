
import React, { Component } from "react"
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
    Annotation,
} from "../../src"
import {StyleSheet, View, Text} from "react-native";
import world from '../../static/world-50m'

// TODO: ZoomableGroup center prop is not working
class AnnotatedMap extends Component {
    render() {
        return (
            <View style={styles.container}>
                <ComposableMap
                    projectionConfig={{
                        scale: 900,
                        rotation: [0,0,0],
                    }}
                    width={980}
                    height={551}
                    style={{
                        width: "100%",
                        height: "auto",
                    }}
                >
                    <ZoomableGroup center={[-76,13.5]} disablePanning>
                        <Geographies geography={world}>
                            {(geographies, projection) =>
                                geographies.map((geography, i) => (
                                    <Geography
                                        key={i}
                                        round
                                        geography={geography}
                                        projection={projection}
                                        style={{
                                            default: {
                                                fill: "#ECEFF1",
                                                stroke: "#607D8B",
                                                strokeWidth: 0.75,
                                                outline: "none",
                                            },
                                            hover: {
                                                fill: "#ECEFF1",
                                                stroke: "#607D8B",
                                                strokeWidth: 0.75,
                                                outline: "none",
                                            },
                                            pressed: {
                                                fill: "#ECEFF1",
                                                stroke: "#607D8B",
                                                strokeWidth: 0.75,
                                                outline: "none",
                                            },
                                        }}
                                    />
                                ))}
                        </Geographies>
                        <Annotation
                            dx={ 40 }
                            dy={ -30 }
                            subject={ [ -61.5, 16.3 ] }
                            strokeWidth={ 1 }
                            stroke="#607D8B"
                        >
                            <Text>{ "Guadaloupe" }</Text>
                        </Annotation>
                        <Annotation
                            dx={ 40 }
                            dy={ -18 }
                            subject={ [ -61.3, 15.4 ] }
                            strokeWidth={ 1 }
                            stroke="#607D8B"
                        >
                            <Text>{ "Dominica" }</Text>
                        </Annotation>
                        <Annotation
                            dx={ 40 }
                            dy={ -4 }
                            subject={ [ -61, 14.7 ] }
                            strokeWidth={ 1 }
                            stroke="#607D8B"
                        >
                            <Text>{ "Matinique" }</Text>
                        </Annotation>
                        <Annotation
                            dx={ -40 }
                            dy={ -20 }
                            subject={ [ -61, 14 ] }
                            strokeWidth={ 1 }
                            stroke="#607D8B"
                        >
                            <Text>{ "St. Lucia" }</Text>
                        </Annotation>
                        <Annotation
                            dx={ 40 }
                            dy={ 10 }
                            subject={ [ -59.5, 13.2 ] }
                            strokeWidth={ 1 }
                            stroke="#607D8B"
                        >
                            <Text>{ "Barbados" }</Text>
                        </Annotation>
                        <Annotation
                            dx={ 60 }
                            dy={ 35 }
                            subject={ [ -61.1, 13.2 ] }
                            strokeWidth={ 1 }
                            stroke="#607D8B"
                        >
                            <Text>{ "St. Vincent and" }</Text>
                            <Text y={18}>{ "the Grenadines" }</Text>
                        </Annotation>
                        <Annotation
                            dx={ -35 }
                            dy={ -15 }
                            subject={ [ -61.7, 12.1 ] }
                            strokeWidth={ 1 }
                            stroke="#607D8B"
                        >
                            <Text>{ "Grenada" }</Text>
                        </Annotation>
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
        fontFamily: "Roboto, sans-serif",
    }
});

export { AnnotatedMap }
