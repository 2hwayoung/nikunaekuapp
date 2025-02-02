import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import 'react-native-gesture-handler';

import AccountItem from '../components/accountitem';
import TopBar from '../components/topbar';
import {
  BLUE_COLOR,
  GREY_40_COLOR,
  GREY_70_COLOR,
  GREY_80_COLOR,
  GREY_90_COLOR,
  RED_COLOR,
  WHITE_COLOR,
} from '../models/colors';
import { AuthContext } from '../utils/context';
import { set } from 'react-native-reanimated';

const MyAccount = ({ route, navigation }) => {
  const { userId, phone, userType, otherParam } = route.params;
  const [logo, setLogo] = useState(null);
  const [store, setStore] = useState(null);

  const ref = firestore().collection('User');

  useEffect(() => {
    const getUserIdAsync = async () => {
      try {
        ref
          .doc(userId)
          .get()
          .then(async function (doc) {
            if (doc.exists) {
              if (userType == 'owner') {
                firestore()
                  .collection('Brand')
                  .doc(doc.data().brandID)
                  .get()
                  .then(async function (ownerDoc) {
                    setLogo(ownerDoc.data().logo);
                    setStore(doc.data().storeID);
                  });
              } else {
                setLogo(doc.data().profileUrl);
              }
            }
          });
      } catch (e) {
        // Restoring Id failed
        console.log('Restoring Id failed');
      }
    };
    getUserIdAsync();
  }, []);

  async function _handleSignOut() {
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userType');
    await AsyncStorage.removeItem('phoneNumber');
    if (userType === 'owner') {
      await AsyncStorage.removeItem('brandId');
      await AsyncStorage.removeItem('storeId');
    }
  }

  async function _handleWithdrawal({ signOut }) {
    Alert.alert('회원 탈퇴', '정말 니쿠내쿠에서 탈퇴하시겠습니까?', [
      {
        text: '취소',
        onPress: () => console.log('회원 탈퇴를 취소합니다.'),
      },
      {
        text: '확인',
        onPress: async () => {
          await AsyncStorage.removeItem('userId');
          await AsyncStorage.removeItem('userType');
          await AsyncStorage.removeItem('phoneNumber');
          if (userType === 'owner') {
            await AsyncStorage.removeItem('brandId');
            await AsyncStorage.removeItem('storeId');
          }
          ref.doc(userId).delete().then(() => {
            console.log('User deleted!');
          });
          signOut();
        },
      }
    ]);
  }

  function _handleChangePW(event) {
    navigation.navigate('비밀번호 찾기');
  }

  return (
    <AuthContext.Consumer>
      {({ signOut }) => (
        <>
          <TopBar
            title="내 정보"
            navigation={navigation}
            drawerShown={true}
            titleColor={GREY_90_COLOR}
          />
          <View style={styles.container}>
            <View style={styles.myinfoContainer}>
              <View style={styles.personIconContainer}>
                {logo ? (
                  <Image
                    source={{ uri: logo }}
                    style={{
                      resizeMode: 'stretch',
                      height: 80,
                      width: 80,
                      borderRadius: 80,
                    }}
                  />
                ) : (
                    <Icon name="person" size={50} color={GREY_40_COLOR} />
                  )}
              </View>
              <View style={styles.myinfoTextContainer}>
                {store && <Text style={styles.myinfoText}>{store}</Text>}
                <Text style={styles.myinfoText}>{userId} 님</Text>
                <Text style={styles.myinfoText}>{phone}</Text>
              </View>
            </View>
            <View style={styles.navigationItemContainer}>
              <AccountItem
                text="로그아웃"
                onPress={() => {
                  signOut();
                  _handleSignOut();
                }}
              />
              <AccountItem
                text="비밀번호 변경"
                onPress={_handleChangePW}
              />
              {userType === 'customer' && (
                <AccountItem
                  text="결제수단 관리"
                  onPress={() => console.log('결제수단 관리')}
                />
              )}
              <AccountItem
                text="탈퇴하기"
                onPress={() => {
                  _handleWithdrawal({ signOut: signOut });
                }}
              />
            </View>
            <View style={styles.flexContainer}></View>
          </View>
        </>
      )}
    </AuthContext.Consumer>
  );
};

const styles = StyleSheet.create({
  benefitsText: {
    color: BLUE_COLOR,
    fontSize: 13,
  },
  benefitsTextContainer: {
    marginHorizontal: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  crownIconContainer: {
    alignItems: 'center',
    height: 70,
    justifyContent: 'center',
    margin: 15,
    width: 70,
  },
  eventBanner: {
    alignItems: 'center',
    backgroundColor: WHITE_COLOR,
    flexDirection: 'row',
    height: 90,
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  eventText: {
    color: GREY_80_COLOR,
    fontSize: 14,
  },
  eventTextHighlight: {
    color: RED_COLOR,
    fontSize: 15,
    fontWeight: 'bold',
  },
  flexContainer: {
    backgroundColor: WHITE_COLOR,
    flex: 1,
    width: '100%',
  },
  myinfoContainer: {
    alignItems: 'center',
    backgroundColor: WHITE_COLOR,
    flexDirection: 'row',
    height: 135,
    paddingHorizontal: 12,
    paddingTop: 25,
  },
  myinfoText: {
    color: GREY_80_COLOR,
    fontSize: 18,
    marginVertical: 2,
  },
  myinfoTextContainer: {
    flex: 4,
    marginHorizontal: 15,
  },
  navigationItemContainer: {
    backgroundColor: WHITE_COLOR,
    marginBottom: 8,
    width: '100%',
  },
  personIconContainer: {
    alignItems: 'center',
    backgroundColor: WHITE_COLOR,
    borderColor: GREY_70_COLOR,
    borderRadius: 50,
    borderWidth: 1,
    height: 70,
    justifyContent: 'center',
    margin: 15,
    width: 70,
  },
});

export default MyAccount;
