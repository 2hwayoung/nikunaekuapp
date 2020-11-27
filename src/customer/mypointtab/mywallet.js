import React, {useEffect, useState}  from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, Modal, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
  GREY_10_COLOR,
  BLACK_COLOR,
  WHITE_COLOR,
  GREY_40_COLOR,
  YELLO_COLOR_BRIGHT, 
  RED_COLOR,
  GREY_80_COLOR
} from '../../models/colors';

const PointItem = ({ point }) => {
  return (
    <Text style={styles.pointText}>{point}원</Text>
  );
};

const PointItems = ({ point }) => {
  return (
    <Text style={styles.detailValue}>{point}원</Text>
  );
};

const MyWallet = ({ route, navigation }) => {
  const [userId, setUserId] = useState(null);
  const [pointItems, setPointItems] = useState(null);
  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isVisible3, setIsVisible3] = useState(false);

  useEffect(() => {
    const getUserIdAsync = async () => {
      try {
        const getUserId = await AsyncStorage.getItem('userId');
        setUserId(getUserId); 
        let ref = firestore().collection('User').doc(getUserId);
        ref.onSnapshot((doc) => {
          const {totalpoint, usedPoint, savePoint, chargePoint} = doc.data();
          let items = {
            totalPoint: totalPoint,
            usedPoint: usedPoint,
            savePoint: savePoint,
            chargePoint: chargePoint
          }
          setPointItems(items);
        })
      } catch (e) {
        // Restoring Id failed
        console.log('Restoring Id failed or Get point data failed');
      }
    };
    getUserIdAsync();
  }, []);

  function _addPointHandler(addPoint){
    Alert.alert('포인트 충전', addPoint+'(원) 포인트를 충전하시겠습니까?', [
      {
        text: '취소',
        onPresse: () => {},
      },
      {
        text: '충전',
        onPress: async () => {
          await firestore().collection('User').doc(userId).update({
            totalPoint: pointItems(totalPoint) + Number(addPoint),
            chargePoint: pointItems(chargePoint) + Number(addPoint)
          });
          setIsVisible1(false);
        },
      },
    ]);
  }

  function _givePointHandler(friendID, givePoint){
    Alert.alert('포인트 선물', friendID+' 에게 '+givePoint+'(원) 포인트를 선물하시겠습니까?', [
      {
        text: '취소',
        onPresse: () => {},
      },
      {
        text: '선물',
        onPress: async () => {
          if (friendID == userId) {
            Alert.alert('자기 자신에게 포인트를 선물할 수 없습니다.');
            return;
          }
          let ref = await firestore().collection('User').doc(friendID);
          if (!((await ref.get()).exists) || (ref.userType != "client")) {
            Alert.alert('해당 아이디는 존재하지 않습니다.')
            return;
          }
          ref.onSnapshot((doc) => {
            const {totalPoint} = doc.data();
            // let friendTotalPoint = totalPoint;
            firestore().collection('User').doc(userID).update({
              totalPoint: pointItems(totalPoint) - Number(givePoint),
              usedPoint: pointItems(usedPoint) + Number(givePoint)
            });
            ref.update({
              totalPoint: firestore().FieldValue.increment(givePoint),
              savePoint: firestore().FieldValue.increment(givePoint), 
            })
          })
          setIsVisible2(false);
        },
      },
    ]);
  }

  function _withdrawePointHandler(withdrawalPoint){
    Alert.alert('포인트 인출', '정말로 포인트를 인출하시겠습니까?', [
      {
        text: '취소',
        onPresse: () => {},
      },
      {
        text: '인출',
        onPress: async () => {
          await firestore().collection('User').doc(userID).update({
            totalPoint: pointItems(totalPoint)-Number(withdrawalPoint),
          });
          setIsVisible3(false);
        },
      },
    ]);
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.maincontainer}>
          <View style={styles.topcontainer}>
            <View style={styles.pointcontainer}>
              <Text style={styles.topText}>보유 포인트</Text>
              <PointItem point={pointItems(totalPoint)}/>
            </View>
            <View style={styles.buttoncontainer}>  
              <View style={styles.threebuttons}>
                <Button title={"충전"} color={YELLO_COLOR_BRIGHT}
                  onPress={() => {
                    setIsVisible1(true);}
                  }>
                </Button>
                <Button title={"선물"} color={YELLO_COLOR_BRIGHT}
                  onPress={() => {
                    setIsVisible2(true);}
                  }>
                </Button>
                <Button title={"인출"} color={YELLO_COLOR_BRIGHT}
                  onPress={() => {
                    setIsVisible3(true);}
                  }>
                </Button>
              </View> 
            </View>
          </View>
          <View>
          </View>
          <View style={styles.detailcontainer}>
            <View style={styles.detailpoint}>
              <Text style={styles.detailText}>적립</Text>
              <PointItem point={pointItems[savePoint]}/>
            </View>
            <View style={styles.detailpoint}>
              <Text style={styles.detailText}>충전</Text>
              <PointItem point={pointItems[chargePoint]}/>
            </View>
            <View style={styles.detailpoint}>
              <Text style={styles.detailText}>사용</Text>
              <PointItem point={pointItems[usedPoint]}/>
            </View>
          </View>
        </View>
      </View>

      {/* add Point Button */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible1}>
        <KeyboardAvoidingView behavior="position">
          <View style={styles.modalView}>
            <View style={styles.modalTopView}>
              <Text style={styles.modalText}>충전</Text>
            </View>
            <View style={styles.modalMidView}>
              <TextInput
                style={styles.input}
                placeholder="충전금액(원)"
                onChangeText={(text) => {
                  setPlusPoint(text);
                  console.log(plusPoint);}}
                autoFocus={true}
                // value={plusPoint}
                clearButtonMode="always"
              />
            </View>
            <View style={styles.modalBottomView}>
              <TouchableOpacity style={styles.button1} onPress={_addPointHandler}>
                <Text style={styles.buttonText}>충전</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button2} onPress={() => {setIsVisible1(false);}}>
                <Text style={styles.buttonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* give Point Button */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible2}>
        <KeyboardAvoidingView behavior="position">
          <View style={styles.modalView2}>
            <View style={styles.modalTopView2}>
              <Text style={styles.modalText}>선물</Text>
            </View>
            <View style={styles.modalMidView2}>
              <TextInput
                style={styles.input}
                placeholder="선물받을 아이디(id)"
                onChangeText={(text) => {
                  setFriendID(text);
                  console.log(friendID);}}
                autoFocus={true}
                clearButtonMode="always"
              />
              <TextInput
                style={styles.input}
                placeholder="선물할 금액(원)"
                onChangeText={(text) => {
                  setPlusPoint(text);
                  console.log(plusPoint);}}
                autoFocus={true}
                clearButtonMode="always"
              />
            </View>
            <View style={styles.modalBottomView2}>
              <TouchableOpacity style={styles.button1} onPress={_givePointHandler}>
                <Text style={styles.buttonText}>선물</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button2} onPress={() => {setIsVisible2(false);}}>
                <Text style={styles.buttonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* withdraw Point Button */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible3}>
        <KeyboardAvoidingView behavior="position">
          <View style={styles.modalView}>
            <View style={styles.modalTopView}>
              <Text style={styles.modalText}>내 계좌로 인출</Text>
            </View>
            <View style={styles.modalMidView}>
              <TextInput
                style={styles.input}
                placeholder="인출할 금액(원)"
                onChangeText={(text) => {
                  setPlusPoint(text);
                  console.log(plusPoint);}}
                autoFocus={true}
                // value={plusPoint}
                clearButtonMode="always"
              />
            </View>
            <View style={styles.modalBottomView}>
              <TouchableOpacity style={styles.button1} onPress={_withdrawePointHandler}>
                <Text style={styles.buttonText}>인출</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button2} onPress={() => {setIsVisible3(false);}}>
                <Text style={styles.buttonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 26,
    alignItems: 'center',
    backgroundColor: GREY_10_COLOR,
  },
  maincontainer:{
    width: 310,
    height : 165,
    padding: 20,
    flexDirection: 'column',
    backgroundColor: WHITE_COLOR,
    borderRadius : 15,
  },
  topcontainer: {
    flex:1,
    flexDirection: 'row',
  },
  pointcontainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  topText: {
    flex: 1,
    color: BLACK_COLOR,
    fontSize : 12,
  },
  pointText: {
    flex: 1,
    color: BLACK_COLOR,
    fontSize: 25,
    fontWeight: 'bold',
  },  
  buttoncontainer: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  threebuttons: {
    flex: 1,
    flexDirection: 'row',
  },
  detailcontainer: {
    flex: 1,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailpoint: {
    flex: 1,
    alignItems: 'center',
  },
  detailText: {
    color: BLACK_COLOR,
    marginTop: 3,
    fontSize: 12,
  },
  detailValue: {
    color: BLACK_COLOR,
    marginTop: 3,
    fontSize: 15,
  },
  modalView: {
    width: 280,
    height : 200,
    marginTop: 320,
    marginLeft: 65,
    flexDirection: 'column',
    backgroundColor: "white",
    justifyContent: 'center',
    alignItems: "center",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modalTopView: {
    flex: 1,
    paddingTop: 20,
  },
  modalMidView: {
    flex: 1,
    width: 200,
  },
  modalBottomView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    marginBottom: 25,
  },
  modalView2: {
    width: 280,
    height : 250,
    marginTop: 320,
    marginLeft: 65,
    flexDirection: 'column',
    backgroundColor: "white",
    justifyContent: 'center',
    alignItems: "center",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modalTopView2: {
    flex: 1,
    paddingTop: 20,
  },
  modalMidView2: {
    flex: 2,
    width: 200,
  },
  modalBottomView2: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  modalText: {
    flex: 1,
    textAlign: "center"
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: GREY_40_COLOR,
    borderRadius: 5,
    justifyContent: 'center',
  },
  button1: {
    flex: 1,
    width: 200,
    marginBottom: 5,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: RED_COLOR,
  },
  button2: {
    flex: 1,
    width: 200,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GREY_80_COLOR,
  },
  buttonText: {
    color: WHITE_COLOR
  }
});

export default MyWallet;
