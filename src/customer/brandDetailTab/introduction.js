import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, LogBox } from 'react-native';

import { BLACK_COLOR } from '../../models/colors';

import firestore from '@react-native-firebase/firestore';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const Introduction = ({ route, navigation }) => {
  const { data, otherParam } = route.params;
  const [description, setDescription] = useState(null);

  let brand = data.id;

  const ref = firestore().collection('Brand').doc(brand);

  useEffect(() => {
    ref.get().then(function (doc) {
      setDescription(doc.data().description);
    });
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.mainText}>{description && description.replace(/\\n/g, '\n')}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: 'center',
  },
  mainText: {
    color: BLACK_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
});

export default Introduction;
