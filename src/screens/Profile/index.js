import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { profile_style } from "../../styles/profile_style";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import API_URL from "../../../config/api";
import { logout } from "../../features/authentication/authSlice";
import SlicePointerPhrase from "../../utils/SlicePointerPhrase";
import { Data } from "../../../assets/json/MenuProfile";

const Item = ({ title, icon, navigation, route, dispatch, token }) => (
  <TouchableOpacity
    style={profile_style.item}
    onPress={() => {
      title == "Sair" ? dispatch(logout(token)) : navigation.navigate(route);
    }}
  >
    <View style={profile_style.containerItemLeft}>
      <Ionicons
        name={icon}
        size={25}
        color={title == "Sair" ? "red" : "#000"}
      />
      <Text
        style={[
          profile_style.itemText,
          { color: title == "Sair" ? "red" : "#000" },
        ]}
      >
        {title}
      </Text>
    </View>
    {title !== "Sair" && (
      <View style={profile_style.containerItemRigth}>
        <MaterialIcons name="chevron-right" size={25} color={"#000"} />
      </View>
    )}
  </TouchableOpacity>
);

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const navigation = useNavigation();
  const [userTotalImovel, setUserTotalImovel] = useState(0);
  const [userTotalFavoritos, setUserTotalFavoritos] = useState(0);
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    getUserTotalImovel(user.id);
    getUserTotalFavotes(user.id);
  }, []);

  async function getUserTotalImovel(user_id) {
    await axios
      .get(API_URL + `api/v1/user/total/imovels/${user_id}`)
      .then((response) => {
        //console.warn(response.data.ownerTotalImovel);
        setUserTotalImovel(response.data.ownerTotalImovel);
      })
      .catch((error) => console.error("Erro ao buscar os dados: " + error));
  }

  async function getUserTotalFavotes(user_id) {
    await axios
      .get(API_URL + `api/v1/user/total/favorites/${user_id}`)
      .then((response) => {
        //console.warn(response.data.userTotalFavorites);
        setUserTotalFavoritos(response.data.userTotalFavorites);
      })
      .catch((error) => console.error("Erro ao buscar os dados: " + error));
  }

  return (
    <View style={profile_style.container}>
      <View style={profile_style.containerProfileDetails}>
        <View style={profile_style.Details}>
          <Image
            source={user.imageProfile === "null" ? require("../../../assets/im/user.png") : {uri: API_URL + "storage/profilePictures/" + user.imageProfile} }
            style={profile_style.imageProfile}
          />
          <Text style={profile_style.name}>{SlicePointerPhrase(user.name, 8)}</Text>
          <Text style={profile_style.PhoneNumber}>{user.phone}</Text>
        </View>
        <View style={profile_style.containerResumeDetails}>
          <View style={profile_style.resumeDetails}>
            <Text style={profile_style.countDetails}>{userTotalImovel}</Text>
            <Text style={profile_style.textDetails}>Imóveis</Text>
          </View>
          <View style={profile_style.resumeDetails}>
            <Text style={profile_style.countDetails}>{userTotalFavoritos}</Text>
            <Text style={profile_style.textDetails}>Favoritos</Text>
          </View>
          <View style={profile_style.resumeDetails}>
            <Text style={profile_style.countDetails}>0</Text>
            <Text style={profile_style.textDetails}>Visualizações</Text>
          </View>
        </View>
      </View>

      <View style={profile_style.containerLinks}>
        <FlatList
          data={Data}
          renderItem={({ item }) => (
            <Item
              title={item.title}
              icon={item.icon}
              navigation={navigation}
              route={item.route}
              dispatch={dispatch}
              token={token}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}
