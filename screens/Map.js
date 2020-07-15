import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback, TouchableOpacity, Picker, FlatList
} from "react-native";
import MapView from "react-native-maps";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as theme from '../theme.js';
import Modal from 'react-native-modal';
import ModalDropdown from 'react-native-modal-dropdown';

const { Marker } = MapView;

const { height, width } = Dimensions.get("screen");

const parkingsSpot = [
  {
    id: 1,
    title: "Parking 1",
    price: 5,
    rating: 4.2,
    spots: 20,
    free: 10,
    coordinate: {
      latitude: 37.78832,
      longitude: -122.4324
    },
    description: `Description about this parking lot 
Open year 2018 
Secure with CTV`,
  },
  {
    id: 2,
    title: "Parking 2",
    price: 7,
    rating: 3.8,
    spots: 25,
    free: 20,
    coordinate: {
      latitude: 37.78842,
      longitude: -122.4324
    },
    description: `Description about this parking lot 
Open year 2018     
Secure with CTV`,
  },
  {
    id: 3,
    title: "Parking 3",
    price: 8,
    rating: 4.9,
    spots: 50,
    free: 20,
    coordinate: {
      latitude: 37.78852,
      longitude: -122.4324
    },
    description: `Description about this parking lot 
Open year 2018 
Secure with CTV`,
  }
];

class ParkingMap extends Component {
  state = {
    hours: {},
    active: null,
    activeModal: null,
  }

  componentWillMount() {
    const { parkings } = this.props;
    const hours = {};

    parkings.map(parking => { hours[parking.id] = 1 });

    this.setState({ hours });
  }
  renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={styles.headerTitle}>Detected location</Text>
          <Text style={styles.headerLocation}>San Francisco, U.S.A.</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
          <TouchableWithoutFeedback>
            <Ionicons name="ios-menu" size={theme.SIZES.icon * 1.5} />
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  };
  handleHours = (id, value) => {
    const { hours } = this.state;
    hours[id] = value;

    this.setState({ hours });
  }
  renderHours(id) {
    const { hours } = this.state;
    const availableHours = [1, 2, 3, 4, 5, 6];

    return (
      <ModalDropdown
        defaultIndex={0}
        options={availableHours}
        style={styles.hoursDropdown}
        defaultValue={`0${hours[id]}:00` || '01:00'}
        dropdownStyle={styles.hoursDropdownStyle}
        onSelect={(index, value) => this.handleHours(id, value)}
        renderRow={(option) => (
          <Text style={styles.hoursDropdownOption}>{`0${option}:00`}</Text>
        )}
        renderButtonText={option => `0${option}:00`}
      />
    )
  }
  renderParking = item => {
    const { hours } = this.state;
    const totalPrice = item.price * hours[item.id];

    return (
      <TouchableWithoutFeedback key={`parking-${item.id}`} onPress={() => this.setState({ active: item.id })}>
        <View style={[styles.parking, styles.shadow]}>
          <View style={styles.hours}>
            <Text style={styles.hoursTitle}>x {item.spots} {item.title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
              {this.renderHours(item.id)}
              <Text style={{ color: theme.COLORS.gray, fontSize: theme.SIZES.font }}>hrs</Text>
            </View>
          </View>
          <View style={styles.parkingInfoContainer}>
            <View style={styles.parkingInfo}>
              <View style={styles.parkingIcon}>
                <Ionicons name="ios-pricetag" size={16} color={theme.COLORS.gray} />
                <Text style={{ marginLeft: theme.SIZES.base }}> ${item.price}</Text>
              </View>
              <View style={styles.parkingIcon}>
                <Ionicons name="ios-star" size={16} color={theme.COLORS.gray} />
                <Text style={{ marginLeft: theme.SIZES.base }}> {item.rating}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.buy} onPress={() => this.setState({ activeModal: item })}>
              <View style={styles.buyTotal}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FontAwesome name="dollar" size={theme.SIZES.icon * 1.25} color={theme.COLORS.white} />
                  <Text style={styles.buyTotalPrice}>{totalPrice}</Text>
                </View>
                {/* {activeModal.price * hours[activeModal.id]} */}
                <Text style={{ color: theme.COLORS.white }}>{item.price}x{hours[item.id]} hrs</Text>
              </View>
              <View style={styles.buyBtn}>
                <FontAwesome name="angle-right" size={theme.SIZES.icon * 1.3} color={theme.COLORS.white} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  renderParkings = () => {
    return (
      <FlatList
        data={this.props.parkings}
        renderItem={({ item }) => this.renderParking(item)}
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        extraData={this.state}
        scrollEventThrottle={16}
        snapToAlignment="center"
        style={styles.parkings}
        keyExtractor={(item, index) => `${item.id}`}
      />
    );
  };
  showModal = () => {
    const { activeModal, hours } = this.state;
    console.log("ACTIVEMODAL", activeModal)
    if (!activeModal) return null;
    return (
      <Modal isVisible
        useNativeDriver
        // swipeDirection='down'
        backdropColor={theme.COLORS.overlay}
        onBackButtonPress={() => this.setState({ activeModal: null })}
        onBackdropPress={() => this.setState({ activeModal: null })}
        onSwipeComplete={() => this.setState({ activeModal: null })}
        style={styles.modalContainer}
      >
        <View style={styles.modal}>
          <View style={{ paddingVertical: theme.SIZES.base }}>
            <Text style={{ fontSize: theme.SIZES.font * 1.5 }}>{activeModal.title}</Text>
          </View>
          <View>
            <Text style={{ color: theme.COLORS.gray, fontSize: theme.SIZES.font * 1.1 }}>{activeModal.description}</Text>
          </View>
          <View style={styles.modalInfo}>

            <View style={{ ...styles.parkingIcon, justifyContent: 'flex-start' }}>
              <Ionicons name="ios-pricetag" size={theme.SIZES.icon * 1.1} color={theme.COLORS.gray} />
              <Text style={{ fontSize: theme.SIZES.icon * 1.15 }}> ${activeModal.price}</Text>
            </View>
            <View style={{ ...styles.parkingIcon, justifyContent: 'flex-start' }}>
              <Ionicons name="ios-star" size={theme.SIZES.icon * 1.1} color={theme.COLORS.gray} />
              <Text style={{ fontSize: theme.SIZES.icon * 1.15 }}> {activeModal.rating}</Text>
            </View>
            <View style={{ ...styles.parkingIcon, justifyContent: 'flex-start' }}>
              <Ionicons name="ios-pin" size={theme.SIZES.icon * 1.1} color={theme.COLORS.gray} />
              <Text style={{ fontSize: theme.SIZES.icon * 1.15 }}> {activeModal.price}km</Text>
            </View>
            <View style={{ ...styles.parkingIcon, justifyContent: 'flex-start' }}>
              <Ionicons name="ios-car" size={theme.SIZES.icon * 1.3} color={theme.COLORS.gray} />
              <Text style={{ fontSize: theme.SIZES.icon * 1.15 }}> {activeModal.free} / {activeModal.spots}</Text>
            </View>

          </View>
          <View style={styles.modalHours}>
            <Text style={{ textAlign: 'center', fontWeight: '500' }}>Choose your Booking Period:</Text>
            <View style={styles.modalHoursDropdown}>
              {this.renderHours(activeModal.id)}
              <Text style={{ color: theme.COLORS.gray }}>hrs</Text>
            </View>
          </View>
          <View>
            <TouchableOpacity style={styles.payBtn}>
              <Text style={styles.payText}>
                Proceed to pay ${activeModal.price * hours[activeModal.id]}
              </Text>
              <FontAwesome name="angle-right" size={theme.SIZES.icon * 1.3} color={theme.COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }
  render() {
    const { currentPosition, parkings } = this.props
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <MapView
          initialRegion={currentPosition}
          style={styles.map}
        >
          {parkings.map(parking =>
            <Marker
              key={`marker-${parking.id}`}
              coordinate={{
                latitude: parking.coordinate.latitude,
                longitude: parking.coordinate.longitude
              }}
            >
              <TouchableWithoutFeedback onPress={() => this.setState({ active: parking.id })}>
                <View style={[styles.marker, styles.shadow, this.state.active === parking.id ? styles.active : null]}>
                  <Text style={styles.markerPrice}>${parking.price}</Text>
                  <Text style={styles.markerStatus}> ({parking.free}/{parking.spots}}</Text>
                </View>
              </TouchableWithoutFeedback>
            </Marker>

          )}
        </MapView>
        {this.renderParkings()}
        {this.showModal()}
      </View>
    );
  }
}
ParkingMap.defaultProps = {
  currentPosition: {
    latitude: 37.78822,
    longitude: -122.4324,
    latitudeDelta: 0.0122,
    longitudeDelta: 0.0121
  },
  parkings: parkingsSpot
}
export default ParkingMap;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white
  },
  header: {
    // flex: 0.4,
    justifyContent: 'center',
    paddingHorizontal: theme.SIZES.base * 2,
    paddingTop: theme.SIZES.base * 3.5,
    paddingBottom: theme.SIZES.base * 1.5,
    flexDirection: 'row',
  },
  headerTitle: { color: theme.COLORS.gray },
  headerLocation: { fontSize: theme.SIZES.font, fontWeight: '500', paddingVertical: theme.SIZES.base / 3 },
  map: { flex: 3 },
  parking: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 6,
    padding: theme.SIZES.base,
    marginHorizontal: theme.SIZES.base * 2,
    width: width - 24 * 2,
    flexDirection: "row"
  },
  parkings: {
    position: "absolute",
    right: 0,
    left: 0,
    bottom: 0,
    paddingBottom: 24,
  },
  buy: { flex: 1, flexDirection: "row", borderRadius: 6, backgroundColor: theme.COLORS.dRed, paddingHorizontal: theme.SIZES.base * 1.5, paddingVertical: theme.SIZES.base },
  buyTotal: { flex: 1, justifyContent: 'space-evenly', },
  buyBtn: { flex: 0.5, justifyContent: "center", alignItems: 'flex-end' },
  buyTotalPrice: { fontSize: theme.SIZES.icon * 2, color: theme.COLORS.white, fontWeight: '600', paddingLeft: theme.SIZES.base / 4 },
  marker: { flex: 1, paddingVertical: 12, paddingHorizontal: 24, paddingVertical: 12, flexDirection: 'row', backgroundColor: theme.COLORS.white, borderColor: theme.COLORS.white, borderRadius: 24, borderWidth: 1, padding: 12, },
  shadow: { shadowColor: theme.COLORS.black, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 4 },
  active: { borderColor: theme.COLORS.dRed, },
  markerPrice: { color: theme.COLORS.dRed, fontWeight: 'bold' },
  markerStatus: { color: theme.COLORS.gray },
  hours: { flex: 1, flexDirection: "column", marginLeft: theme.SIZES.base / 2, justifyContent: 'space-evenly' },
  hoursTitle: { fontSize: theme.SIZES.font, fontWeight: '500' },
  hoursDropdown: { borderRadius: theme.SIZES.base / 2, borderColor: theme.COLORS.overlay, borderWidth: 1, padding: theme.SIZES.base, marginRight: theme.SIZES.base / 2 },

  hoursDropdownStyle: { marginLeft: -theme.SIZES.base, paddingHorizontal: theme.SIZES.base / 2, marginVertical: -(theme.SIZES.base + 1) },
  hoursDropdownOption: {
    padding: 5,
    fontSize: theme.SIZES.font * 0.8,
  },
  parkingInfoContainer: { flex: 1.5, flexDirection: "row" },
  parkingInfo: { justifyContent: 'space-evenly', marginHorizontal: theme.SIZES.base * 1.5, },
  parkingIcon: { flexDirection: 'row', justifyContent: 'space-between', },
  modalContainer: { margin: 0, justifyContent: 'flex-end' },
  modal: { flexDirection: 'column', backgroundColor: theme.COLORS.white, borderTopLeftRadius: theme.SIZES.base, borderTopRightRadius: theme.SIZES.base, padding: theme.SIZES.base * 2, height: height * 0.75, },
  modalInfo: { flexDirection: 'row', justifyContent: 'space-evenly', paddingVertical: theme.SIZES.base, borderTopWidth: 1, borderTopColor: theme.COLORS.overlay, borderBottomWidth: 1, borderBottomColor: theme.COLORS.overlay },
  modalHours: { flex: 1, justifyContent: 'center' },

  modalHoursDropdown: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.SIZES.base,
  },

  payBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.COLORS.red, padding: theme.SIZES.base * 1.5, borderRadius: 6 },
  payText: { fontWeight: '600', fontSize: theme.SIZES.base * 1.5, color: theme.COLORS.white },
});
