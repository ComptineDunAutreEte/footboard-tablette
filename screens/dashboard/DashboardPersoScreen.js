import React from "react";
import { Dimensions, Text, View, StyleSheet, ScrollView, FlatList } from 'react-native';
import {
    VictoryBar, VictoryChart, VictoryLabel, VictoryLegend, VictoryLine, VictoryPie,
    VictoryTheme, VictoryAnimation, VictoryPolarAxis, VictoryGroup, VictoryArea
} from "victory-native";
import Colors from "../../constants/Colors";
import SubTitleComponent from "../../components/title/SubTitleComponent";
import CategoryDetailComponent from "../../components/dashboard/CategoryDetailComponent";
import { categories } from "../../model/categories";
import MainTitle from "../../components/title/MainTitleComponent";
import { UserResponseInformationsService } from "../../services/UserResponseInformationsService";

export default class DashboardPersoScreen extends React.Component {

    constructor(props) {
        super(props);


        userResponsesService = new UserResponseInformationsService();
        const userResponses = userResponsesService.createResponses();
        const generalResponses = userResponsesService.createResponses(userResponses.length);

        this.userDatas = this.retrieveResponses(userResponses);
        this.generalDatas = this.retrieveResponses(generalResponses);


        this.goodResponsesByCategories = [[], []];

        categories.forEach((category) => {
            this.goodResponsesByCategories[0].push({
                category: category.key,
                goodResponses: 0,
                totalQuestions: 0
            });
            this.goodResponsesByCategories[1].push({
                category: category.key,
                goodResponses: 0,
                totalQuestions: 0
            })
        });

        userResponses.forEach((userResponse) => {
            const cat = this.goodResponsesByCategories[0].find((c) => c.category === userResponse.category);
            cat.totalQuestions++;
            if (userResponse.isGoodResponse) {
                cat.goodResponses++;
            }
        });

        generalResponses.forEach((generalResponse) => {
            const cat = this.goodResponsesByCategories[1].find((c) => c.category === generalResponse.category);
            cat.totalQuestions++;
            if (generalResponse.isGoodResponse) {
                cat.goodResponses++;
            }
        });

        this.characterDatas = [{}, {}];
        this.goodResponsesByCategories[0].forEach((data) => {
            if (data.totalQuestions > 0) {
                this.characterDatas[0][data.category] = parseInt((data.goodResponses * 100) / data.totalQuestions);
            } else {
                this.characterDatas[0][data.category] = 0;
            }
        });

        this.goodResponsesByCategories[1].forEach((data) => {
            if (data.totalQuestions > 0) {
                this.characterDatas[1][data.category] = parseInt((data.goodResponses * 100) / data.totalQuestions);
            } else {
                this.characterDatas[1][data.category] = 0;
            }
        });

        generalResponses.forEach((generalResponse) => {
            const cat = this.goodResponsesByCategories[1].find((c) => c.category === generalResponse.category);
            cat.totalQuestions++;
            if (generalResponse.isGoodResponse) {
                cat.goodResponses++;
            }
        });
        this.categories = categories;

        this.state = {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            data: this.processData(this.characterDatas),
            maxima: this.getMaxima(this.characterDatas)
        };

        this.nQuestions = [];
        for (let i = 1; i < this.userDatas.length + 1; i++) {
            this.nQuestions.push(i.toString());
        }
    }

    retrieveResponses(responses) {
        let datas = [];

        responses.forEach((response, i) => {
            datas.push({
                x: i + 1,
                y: response.responseTime
            });
        });

        return datas;
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.stats}>

                    <MainTitle title={"Vos statistiques personnelles"}/>

                    <View style={styles.responseTime}>
                        <SubTitleComponent title={"Temps de réponse par questions"}/>
                        <VictoryChart height={350} theme={VictoryTheme.material}>

                            <VictoryLabel x={10} y={230} style={styles.label} text={"Temps en secondes"} angle={-90}/>
                            <VictoryLabel x={300} y={340} style={styles.label} text={"Numéro de question"}/>

                            <VictoryLine
                                style={{
                                    data: {stroke: "tomato", strokeWidth: 2},
                                    parent: {border: "1px solid #ccc"}
                                }}
                                interpolation="natural"
                                domain={{x: [1, this.userDatas.length], y: [0, 16]}}
                                categories={{x: this.nQuestions}}
                                labels={(datum) => datum.y}
                                labelComponent={<VictoryLabel renderInPortal dy={20}/>}
                                data={this.userDatas}
                            />

                            <VictoryLine
                                style={{
                                    data: {stroke: "gold", strokeWidth: 2},
                                    parent: {border: "1px solid #ccc"}
                                }}
                                interpolation="natural"
                                domain={{x: [1, this.generalDatas.length], y: [0, 16]}}
                                categories={{x: this.nQuestions}}
                                data={this.generalDatas}
                            />

                            <VictoryLegend
                                x={this.state.width / 2 - 50} y={0}
                                centerTitle
                                orientation="horizontal"
                                gutter={20}
                                style={{border: {stroke: "#eee"}, title: {fontSize: 20}}}
                                data={[
                                    {name: "Personnel", symbol: {fill: "tomato"}},
                                    {name: "Moyenne des autres utilisateurs", symbol: {fill: "gold"}}
                                ]}
                            />
                        </VictoryChart>
                    </View>

                    <View style={styles.container2}>
                        <View style={styles.leftBottomContainer}>

                            <SubTitleComponent title={"Détail par catégories"}/>

                            {
                                this.categories.map((category) => {
                                    const myStatistique = this.goodResponsesByCategories[0].find((s) => s.category === category.key);

                                    if (myStatistique) {
                                        return (
                                            <CategoryDetailComponent
                                                key={category.key}
                                                pastilleColor={category.color}
                                                categoryTitle={category.key}
                                                goodResponses={myStatistique.goodResponses}
                                                totalQuestions={myStatistique.totalQuestions}
                                            />
                                        );
                                    }
                                })
                            }
                        </View>
                        <View style={styles.rightBottom}>
                            <SubTitleComponent title={"Pourcentage de bonnes réponses"}/>
                            <VictoryChart polar width={400} height={460} theme={VictoryTheme.material}>

                                <VictoryLegend
                                    x={10} y={0}
                                    centerTitle
                                    orientation="horizontal"
                                    gutter={20}
                                    style={{border: {stroke: "#eee"}, title: {fontSize: 20}}}
                                    data={[
                                        {name: "Personnel", symbol: {fill: "tomato"}},
                                        {name: "Moyenne des autres utilisateurs", symbol: {fill: "gold"}}
                                    ]}
                                />

                                <VictoryGroup colorScale={["tomato", "gold"]}
                                              style={{data: {fillOpacity: 0.2, strokeWidth: 2}}}>
                                    {this.state.data.map((data, i) => {
                                        return <VictoryArea key={i} data={data}/>;
                                    })}
                                </VictoryGroup>

                                {
                                    Object.keys(this.state.maxima).map((key, i) => {
                                        return (
                                            <VictoryPolarAxis
                                                key={i} dependentAxis style={axisStyle}
                                                tickLabelComponent={
                                                    <VictoryLabel labelPlacement="vertical"/>
                                                }
                                                labelPlacement="perpendicular"
                                                axisValue={i + 1} label={key}
                                                tickFormat={(t) => Math.ceil(t * this.state.maxima[key])}
                                                tickValues={[0.25, 0.5, 0.75, 1]}
                                            />
                                        );
                                    })
                                }
                            </VictoryChart>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }

    _renderItem = ({item}) => <Text>{item.email}</Text>

    getMaxima(data) {
        const groupedData = Object.keys(data[0]).reduce((memo, key) => {
            memo[key] = data.map((d) => d[key]);
            return memo;
        }, {});
        return Object.keys(groupedData).reduce((memo, key) => {
            memo[key] = 100;
            return memo;
        }, {});
    }

    processData(data) {
        const maxByGroup = this.getMaxima(data);
        const makeDataArray = (d) => {
            return Object.keys(d).map((key) => {
                return {x: key, y: d[key] / maxByGroup[key]};
            });
        };
        return data.map((datum) => makeDataArray(datum));
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    stats: {
        flex: 1,
    },
    container2: {
        flex: 1,
        flexDirection: 'row',
    },
    responseTime: {
        backgroundColor: '#fff',
        padding: 10,
        borderColor: '#eee',
        borderWidth: 1,
        marginBottom: 20,
        borderRadius: 5,
    },
    leftBottomContainer: {
        width: '40%',
        backgroundColor: '#fff',
        borderColor: '#eee',
        borderWidth: 1,
        padding: 10,
        marginRight: 10,
        borderRadius: 5,
    },
    rightBottom: {
        width: '60%',
        backgroundColor: '#fff',
        borderColor: '#eee',
        borderWidth: 1,
        padding: 10,
        marginLeft: 10,
        borderRadius: 5,
    },
    label: {
        color: "#555"
    },
});

const axisStyle = {
    axisLabel: {padding: 30},
    axis: {stroke: "none"},
    grid: {
        stroke: "grey",
        strokeWidth: 0.25,
        opacity: 0.5
    }
};