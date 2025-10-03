import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios'

const API_URL = 'https://api.openweathermap.org/data/2.5/weather'
const API_KEY = '3871f2710964673b949f53f493ea2604'


export default function App() {
  const [weather, setWeather] = useState();


  //Ativado ao ligar o app
  useEffect(() => {
    getLocation()

  }, [])

  async function getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const response = await axios.get(API_URL, {
      params: {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        appid: API_KEY,
        units: 'metric',
        lang: 'pt_br'
      }
    });
    setWeather(response.data)
  }

  const getBackgroundColor = () => {
    const main = weather.weather[0].main.toLowerCase();
    if (main.includes('rain')) return '#4a7c8e';
    if (main.includes('cloud')) return '#8b95a1';
    if (main.includes('clear')) return '#87ceeb';
    return '#6495ed'
  }


  if (!weather) {
    return (
      <View>
        <Text>Carregando informações do tempo...</Text>
      </View>
    )
  }


  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <Text style={styles.cityName}>{weather.name}</Text>
      <Text style={styles.temperature}>{Math.round(weather.main.temp)} °C</Text>
      <Text style={styles.description}>{weather.weather[0].description}</Text>

      <View style={styles.infoContainer}>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Sensação térmica</Text>
          <Text style={styles.infoValue}>{Math.round(weather.main.feels_like)} °C</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Umidade</Text>
          <Text style={styles.infoValue}>{weather.main.humidity}%</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Vento</Text>
          <Text style={styles.infoValue}>{weather.wind.speed} m/s</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cityName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10
  },
  temperature: {
    fontSize: 72,
    fontWeight: '300',
    color: '#fff',
    marginBottom: 10
  },
  description: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 40,
    textTransform: 'capitalize'
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  },
  infoBox: {
   alignItems: 'center',
   backgroundColor: 'rgba(255, 255, 255, 0.2)',
   padding: 15,
   borderRadius: 10,
   minWidth: 80
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    opacity: 0.8,
    marginBottom: 5
  },
  infoValue: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold'
  }
});
