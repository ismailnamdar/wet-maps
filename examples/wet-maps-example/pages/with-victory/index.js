
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Markers, Marker} from "../../src";
import { geoAlbers } from "d3-geo"
import { VictoryPie } from "victory-native"


import { G, Circle } from 'react-native-svg';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

import cantonss from '../../static/cantons';
import world from '../../static/world-110m';

import { cantons } from "../../data"

type Props = {};
class WithVictory extends Component<Props> {
    constructor() {
        super()
        this.state = {
            cantons: [],
            isLoading: false
        }
    }
    componentDidMount() {
        this.setState({
            cantons: cantons,
        })
    }

    projection(width, height) {
        return geoAlbers()
            .rotate([0,0])
            .center([8.3, 46.8])
            .scale(14000)
            .translate([width / 2, height / 2])
    }

    render() {
        if(this.state.isLoading) { return <View><ActivityIndicator size={'large'}/></View>}
        console.log("canton: ", cantons);
        return (
            <View style={styles.container}>
                <ComposableMap
                    projection={this.projection}
                    width={980}
                    height={551}
                    style={{
                        width: "100%",
                        height: "auto",
                    }}
                >
                    <ZoomableGroup parentWidth={980} parentHeight={551} center={[-8.3,-46.8]}  disablePanning>
                    <Geographies geography={cantonss}>
                        {(geographies, projection) =>
                            geographies.map((geography, i) =>
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
                            )}
                    </Geographies>
                    <Markers>
                        {this.state.cantons.map((canton, i) => (
                            <Marker
                                key={ `canton-${canton.id}` }
                                marker={ canton }
                                style={{
                                    default: {
                                        outline: "none",
                                    },
                                    hover: {
                                        outline: "none",
                                    },
                                    pressed: {
                                        outline: "none",
                                    },
                                }}
                            >
                                <G transform={{ translate: "-15, -15" }}>
                                    <Circle cx={20} cy={20} r={21} fill="transparent" stroke="#607D8B" strokeWidth={1}/>
                                    <Circle cx={20} cy={20} r={9} fill="transparent" stroke="#607D8B" strokeWidth={1}/>
                                    <VictoryPie
                                        standalone={ false }
                                        width={ 40 }
                                        height={ 40 }
                                        padding={ 0 }
                                        innerRadius={ 10 }
                                        style={{
                                            labels: { fill: "transparent" },
                                            data: { stroke: "#ECEFF1" },
                                        }}
                                        colorScale={["tomato", "orange", "gold", "cyan", "navy" ]}
                                        data={[
                                            { x: null, y: canton.languages[0].value, fill: "#FF5722" },
                                            { x: null, y: canton.languages[1].value, fill: "#00BCD4" },
                                            { x: null, y: canton.languages[2].value, fill: "#FFC107" },
                                            { x: null, y: canton.languages[3].value, fill: "#8BC34A" },
                                        ]}
                                        events={[{
                                            eventHandlers: {
                                                onClick: () => {
                                                    this.setState({isLoading: true});
                                                }
                                            }
                                        }]}
                                    />
                                </G>
                            </Marker>
                        ))}
                    </Markers>
                    </ZoomableGroup>
                </ComposableMap>
            </View>
        );
    }
}

//
// <ZoomableGroup center={[-8.3,-46.8]} disablePanning>
// </ZoomableGroup>

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

export { WithVictory };
