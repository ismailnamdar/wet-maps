/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';

import {
    CustomSVGMarkers,
    WithVictory,
    BasicMap,
    AlbersUSA,
    PatternMap,
    BubblesMap,
    GraticuleMap,
    Globe,
    AnnotatedMap,
    ChoroplethMap,
    CountryMap,
    CustomMap,
    CustomProjectionMap,
    ExcludeIncludeGeographies,
    SelectGeographies,
    SimpleMarkers,
    UpdatableChoropleth
} from './pages';

export default class App extends Component<Props> {
    render() {
        return (
            <AnnotatedMap/>
        );
    }
}


