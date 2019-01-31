import React from "react";
import { Modal, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Colors from "../constants/Colors";
import { Dimensions, PixelRatio } from 'react-native'
import PseudoService from "../services/PseudoService";
import { Button } from 'react-native-elements';
import * as Alert from "react-native";
import DashboardScreen from "../screens/DashboardScreen";
import GameService from "../services/GameService";

class HeaderComponent extends React.Component {

    constructor(props) {
        super(props);
        this.width = Dimensions.get('window').width * PixelRatio.get();
        this.height = Dimensions.get('window').height * PixelRatio.get();
        this.pseudoService = new PseudoService();
        this.gameService = new GameService();
        this.state = {
            pseudo: null,
            modalVisible: false,
            isInGame: false,
        }
    }

    componentDidMount() {
        this.pseudoService.getPseudo().then((pseudo) => {
            this.setState({
                pseudo: pseudo
            })
        });

        this.gameService.isInGame().then((isInGame) => {
            this.setState({
                isInGame: isInGame
            })
        })
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    render() {
        const {pseudo} = this.state;

        return (
            <View style={styles.header}>
                <View style={styles.logo}>
                    <Text style={styles.headerTitle}>FOOTBOARD</Text>
                </View>
                <View style={styles.menu}>

                    <Button
                        buttonStyle={styles.buttonMenu}
                        title={"Statistiques"}
                        titleStyle={styles.buttonTextMenu}
                        onPress={() => {
                            this.setModalVisible(true);
                        }}
                        disabled={this.state.isInGame}
                    />


                </View>
                <View style={styles.profil}>
                    <Text>Pseudo : {pseudo} | Niveau : Expert en foot</Text>
                </View>

                <Modal animationType="slide" transparent={false} visible={this.state.modalVisible}>
                    <View>
                        <Button
                            title={"Fermer les statistiques"}
                            onPress={() => {
                                this.setModalVisible(!this.state.modalVisible);
                            }}
                        />
                    </View>
                    <View style={{marginTop: 22, flex: 1,}}>
                        <DashboardScreen/>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: Colors.WHITE,
        padding: 20,
        fontSize: 20,
        shadowColor: Colors.BLACK,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
        flexDirection: 'row',
        width: "100%"

    },
    headerTitle: {
        color: Colors.DARK_BLUE,
        fontSize: 25,
        backgroundColor: "#fff",
        width: Dimensions.get('window').width * PixelRatio.get() / 6,
    },
    menu: {
        width: Dimensions.get('window').width * PixelRatio.get() / 3.5,
        backgroundColor: "#fff",
        alignItems: "center"
    },
    profil: {
        width: Dimensions.get('window').width * PixelRatio.get() / 6,
        backgroundColor: "#fff",
        alignItems: "center"
    },
    buttonMenu: {
        backgroundColor: Colors.WHITE,
        width: 200,
    },
    buttonTextMenu: {
        fontWeight: "bold",
        color: Colors.DARK_BLUE
    }
});

export default HeaderComponent;