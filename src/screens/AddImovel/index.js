import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { addImovel_style } from "../../styles/addImovel_style";
import { Dropdown } from "react-native-element-dropdown";
import Button from "../../components/button/Button";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import API_URL from "../../../config/api";
import axios from "axios";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

export default function AddImovel() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [dataProvince, setDataProvince] = useState([]);
  const [dataCounty, setDataCounty] = useState([]);
  const [county, setCounty] = useState(null);
  const [typeStatus, setTypeStatus] = useState(null);
  const [price, setPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [totalArea, setTotalArea] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(1);
  const [image01, setImage01] = useState(null);
  const [image02, setImage02] = useState(null);
  const [image03, setImage03] = useState(null);
  const [image04, setImage04] = useState(null);
  const [totalBedrooms, setTotalBedrooms] = useState(0);
  const [totalWC, setTotalWC] = useState(0);
  const [totalChinken, setTotalChinken] = useState(0);
  const [province, setProvince] = useState(null);

  // Function for Update screen
  async function fresh() {
    setLatitude("");
    setLongitude("");
    setDataProvince([]);
    setDataCounty([]);
    setCounty(null);
    setTypeStatus(null);
    setPrice("");
    setTotalArea("");
    setImage01(null);
    setImage02(null);
    setImage03(null);
    setImage04(null);
    setTotalBedrooms(0);
    setTotalWC(0);
    setTotalChinken(0);
    setProvince(null);
    await axios
      .get(API_URL + `api/v1/provincia`)
      .then((response) => setDataProvince(response.data))
      .catch((error) => {
        console.error("Erro ao recuperar os dados do usuário:", error);
      });
  }

  // get Province Data for show in Province Dropdown
  useEffect(() => {
    axios
      .get(API_URL + `api/v1/provincia`)
      .then((response) => setDataProvince(response.data))
      .catch((error) => {
        console.error("Erro ao recuperar os dados do usuário:", error);
      });
  }, []);

  const formatedProvinceData = dataProvince.map((opcao) => ({
    label: opcao.name,
    value: opcao.id, // Valor é a opção em minúsculas sem espaços
  }));

  // Increment value in NumberBedrooms, wc, chinken
  function incrementTotal(typeTotal) {
    if (typeTotal == "totalBedrooms") {
      setTotalBedrooms(totalBedrooms + 1);
    } else if (typeTotal == "totalWC") {
      setTotalWC(totalWC + 1);
    } else if (typeTotal == "totalChinken") {
      setTotalChinken(totalChinken + 1);
    }
  }

  // Decrement value in NumberBedrooms, wc, chinken
  function decrementTotal(typeTotal) {
    if (typeTotal == "totalBedrooms" && totalBedrooms > 0) {
      setTotalBedrooms(totalBedrooms - 1);
    } else if (typeTotal == "totalWC" && totalWC > 0) {
      setTotalWC(totalWC - 1);
    } else if (typeTotal == "totalChinken" && totalChinken > 0) {
      setTotalChinken(totalChinken - 1);
    }
  }

  async function submitImovelData() {
    const uri01 = image01;
    const filename01 = image01.split("/").pop();
    const match01 = /\.(\w+)$/.exec(filename01);
    const ext01 = match01?.[1];
    const type01 = match01 ? `image/${match01[1]}` : `image`;

    const uri02 = image02;
    const filename02 = image02.split("/").pop();
    const match02 = /\.(\w+)$/.exec(filename02);
    const ext02 = match02?.[1];
    const type02 = match02 ? `image/${match02[1]}` : `image`;

    const uri03 = image03;
    const filename03 = image03.split("/").pop();
    const match03 = /\.(\w+)$/.exec(filename03);
    const ext03 = match03?.[1];
    const type03 = match03 ? `image/${match03[1]}` : `image`;

    const uri04 = image04;
    const filename04 = image04.split("/").pop();
    const match04 = /\.(\w+)$/.exec(filename04);
    const ext04 = match04?.[1];
    const type04 = match04 ? `image/${match04[1]}` : `image`;

    const formData = new FormData();
    formData.append("type_imovel_id", selectedCategory);
    formData.append("province_id", province);
    formData.append("county_id", county);
    formData.append("owner_id", 1);
    formData.append("total_bedrooms", totalBedrooms);
    formData.append("total_wc", totalWC);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("area_total", totalArea);
    formData.append("status", typeStatus == 1 ? "a venda" : "aluguer");
    formData.append("price", price);
    formData.append("image01", {
      uri: uri01,
      type: type01,
      name: "imovel.jpg",
    });
    formData.append("image02", {
      uri: uri02,
      type: type02,
      name: "imovel.jpg",
    });
    formData.append("image03", {
      uri: uri03,
      type: type03,
      name: "imovel.jpg",
    });
    formData.append("image04", {
      uri: uri04,
      type: type04,
      name: "imovel.jpg",
    });

    console.log(formData._parts);

    await axios
      .post(API_URL + `api/v1/criar/imovel`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        fresh();
        console.warn("Enviado com sucesso");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // show Imovel categories in flatlist
  const Item = ({ item, backgroundColor, onPress }) => (
    <TouchableOpacity
      style={[addImovel_style.categoryImovel, { backgroundColor }]}
      onPress={() => {
        onPress();
        handlePressSelectedCategory(item.id);
        fresh();
      }}
    >
      <Icon2 name={item.icon} size={20} color="#000" />
      <Text style={addImovel_style.categoryImovelText}>{item.type}</Text>
    </TouchableOpacity>
  );
  const renderItem = ({ item }) => {
    const backgroundColor =
      item.id === selectedItemId ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.0)";

    return (
      <Item
        item={item}
        onPress={() => setSelectedItemId(item.id)}
        backgroundColor={backgroundColor}
      />
    );
  };

  // get value of the Selected Category
  const handlePressSelectedCategory = (type) => {
    setSelectedCategory(type);
  };

  const fetchCountyData = async (id) => {
    await axios
      .get(API_URL + `api/v1/provincia/localidade/${id}`)
      .then((response) => setDataCounty(response.data))
      .catch((error) => {
        console.error("Erro ao obter dados da API:", error);
      });
  };

  const formatedCountyData = dataCounty.map((opcao) => ({
    label: opcao.name,
    value: opcao.id, // Valor é a opção em minúsculas sem espaços
  }));

  const categoriesData = [
    {
      id: 1,
      type: "Casas",
      icon: "house",
    },
    {
      id: 2,
      type: "Apartamentos",
      icon: "apartment",
    },
    {
      id: 3,
      type: "Terrenos",
      icon: "landscape",
    },
    {
      id: 4,
      type: "Quartos",
      icon: "single-bed",
    },
  ];

  const typeStatusData = [
    { label: "a venda", value: 1 },
    { label: "aluguer", value: 2 },
  ];

  // Function Async, for Acess Galery of the dispositive, and get Photo
  const pickImage01 = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const originalWidth = result.assets[0].width;
      const originalHeight = result.assets[0].height;

      // Define as dimensões máximas desejadas
      const maxWidth = 800;
      const maxHeight = 600;

      // Calcula as novas dimensões mantendo a proporção original
      const aspectRatio = originalWidth / originalHeight;
      let newWidth = maxWidth;
      let newHeight = newWidth / aspectRatio;

      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
      }

      // Redimensiona a imagem
      const resizedImage = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: newWidth, height: newHeight } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );

      setImage01(resizedImage.uri);
      console.log(resizedImage);
    }
  };
  const pickImage02 = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const originalWidth = result.assets[0].width;
      const originalHeight = result.assets[0].height;

      // Define as dimensões máximas desejadas
      const maxWidth = 800;
      const maxHeight = 600;

      // Calcula as novas dimensões mantendo a proporção original
      const aspectRatio = originalWidth / originalHeight;
      let newWidth = maxWidth;
      let newHeight = newWidth / aspectRatio;

      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
      }

      // Redimensiona a imagem
      const resizedImage = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: newWidth, height: newHeight } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );
      setImage02(resizedImage.uri);
      console.log(resizedImage.uri);
    }
  };
  const pickImage03 = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const originalWidth = result.assets[0].width;
      const originalHeight = result.assets[0].height;

      // Define as dimensões máximas desejadas
      const maxWidth = 800;
      const maxHeight = 600;

      // Calcula as novas dimensões mantendo a proporção original
      const aspectRatio = originalWidth / originalHeight;
      let newWidth = maxWidth;
      let newHeight = newWidth / aspectRatio;

      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
      }

      // Redimensiona a imagem
      const resizedImage = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: newWidth, height: newHeight } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );
      setImage03(resizedImage.uri);
      console.log(resizedImage.uri);
    }
  };
  const pickImage04 = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const originalWidth = result.assets[0].width;
      const originalHeight = result.assets[0].height;

      // Define as dimensões máximas desejadas
      const maxWidth = 800;
      const maxHeight = 600;

      // Calcula as novas dimensões mantendo a proporção original
      const aspectRatio = originalWidth / originalHeight;
      let newWidth = maxWidth;
      let newHeight = newWidth / aspectRatio;

      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
      }

      // Redimensiona a imagem
      const resizedImage = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: newWidth, height: newHeight } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );
      setImage04(resizedImage.uri);
      console.log(resizedImage.uri);
    }
  };

  return (
    <ScrollView
      style={addImovel_style.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={addImovel_style.header}>
        <Text style={addImovel_style.headerTitle01}>Descreva o seu</Text>
        <Text style={addImovel_style.headerTitle02}>Imóvel</Text>
      </View>
      <View>
        <FlatList
          data={categoriesData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          extraData={selectedItemId}
        />
      </View>
      <View style={addImovel_style.containerFormAddress}>
        <Text style={addImovel_style.subtitle}>Localização</Text>

        <Dropdown
          style={addImovel_style.dropdown}
          placeholderStyle={addImovel_style.placeholderStyle}
          selectedTextStyle={addImovel_style.selectedTextStyle}
          inputSearchStyle={addImovel_style.inputSearchStyle}
          iconStyle={addImovel_style.iconStyle}
          data={formatedProvinceData}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Selecione a Província"
          value={province}
          onChange={(item) => {
            setProvince(item.value);
            fetchCountyData(item.value);
          }}
        />

        {province !== null && (
          <Dropdown
            style={addImovel_style.dropdown}
            placeholderStyle={addImovel_style.placeholderStyle}
            selectedTextStyle={addImovel_style.selectedTextStyle}
            inputSearchStyle={addImovel_style.inputSearchStyle}
            iconStyle={addImovel_style.iconStyle}
            data={formatedCountyData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Selecione o município"
            value={county}
            onChange={(item) => {
              setCounty(item.value);
            }}
          />
        )}

        <TextInput
          style={addImovel_style.input}
          onChangeText={setLatitude}
          value={latitude}
          placeholder="Insira a latitude"
          keyboardType="default"
        />
        <TextInput
          style={addImovel_style.input}
          onChangeText={setLongitude}
          value={longitude}
          placeholder="Insira a longitude"
          keyboardType="default"
        />
      </View>
      {selectedCategory === 3 && (
        <View style={addImovel_style.containerFormInfo}>
          <Text style={addImovel_style.subtitle}>Informações Básicas</Text>
          <Dropdown
            style={addImovel_style.dropdown}
            placeholderStyle={addImovel_style.placeholderStyle}
            selectedTextStyle={addImovel_style.selectedTextStyle}
            inputSearchStyle={addImovel_style.inputSearchStyle}
            iconStyle={addImovel_style.iconStyle}
            data={typeStatusData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="qual o tipo de transação"
            value={typeStatus}
            onChange={(item) => {
              setTypeStatus(item.value);
            }}
          />

          <TextInput
            style={addImovel_style.input}
            onChangeText={setPrice}
            value={price}
            placeholder="Informe o preço"
            keyboardType="numeric"
          />

          <TextInput
            style={addImovel_style.input}
            onChangeText={setTotalArea}
            value={totalArea}
            placeholder="Informe a Area total em metros"
            keyboardType="numeric"
          />
        </View>
      )}
      {selectedCategory === 1 && (
        <View style={addImovel_style.containerFormInfo}>
          <Text style={addImovel_style.subtitle}>Informações Básicas</Text>

          <View style={addImovel_style.containerCounters}>
            <Text style={addImovel_style.containerCountersText}>
              Numero de Quartos
            </Text>
            <View style={addImovel_style.counter}>
              <TouchableOpacity
                style={addImovel_style.counterBtn}
                onPress={() => incrementTotal("totalBedrooms")}
              >
                <Text style={addImovel_style.counterBtnText}>+</Text>
              </TouchableOpacity>
              <Text>{totalBedrooms}</Text>
              <TouchableOpacity
                style={addImovel_style.counterBtn}
                onPress={() => decrementTotal("totalBedrooms")}
              >
                <Text style={addImovel_style.counterBtnText}>-</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={addImovel_style.containerCounters}>
            <Text style={addImovel_style.containerCountersText}>
              Numero de WC
            </Text>
            <View style={addImovel_style.counter}>
              <TouchableOpacity
                style={addImovel_style.counterBtn}
                onPress={() => incrementTotal("totalWC")}
              >
                <Text style={addImovel_style.counterBtnText}>+</Text>
              </TouchableOpacity>
              <Text>{totalWC}</Text>
              <TouchableOpacity
                style={addImovel_style.counterBtn}
                onPress={() => decrementTotal("totalWC")}
              >
                <Text style={addImovel_style.counterBtnText}>-</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={addImovel_style.containerCounters}>
            <Text style={addImovel_style.containerCountersText}>
              Numero de Cosinhas
            </Text>
            <View style={addImovel_style.counter}>
              <TouchableOpacity
                style={addImovel_style.counterBtn}
                onPress={() => incrementTotal("totalChinken")}
              >
                <Text style={addImovel_style.counterBtnText}>+</Text>
              </TouchableOpacity>
              <Text>{totalChinken}</Text>
              <TouchableOpacity
                style={addImovel_style.counterBtn}
                onPress={() => decrementTotal("totalChinken")}
              >
                <Text style={addImovel_style.counterBtnText}>-</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Dropdown
            style={addImovel_style.dropdown}
            placeholderStyle={addImovel_style.placeholderStyle}
            selectedTextStyle={addImovel_style.selectedTextStyle}
            inputSearchStyle={addImovel_style.inputSearchStyle}
            iconStyle={addImovel_style.iconStyle}
            data={typeStatusData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="qual o tipo de transação"
            value={typeStatus}
            onChange={(item) => {
              setTypeStatus(item.value);
            }}
          />

          <TextInput
            style={addImovel_style.input}
            onChangeText={setPrice}
            value={price}
            placeholder="Informe o preço"
            keyboardType="numeric"
          />

          <TextInput
            style={addImovel_style.input}
            onChangeText={setTotalArea}
            value={totalArea}
            placeholder="Informe a Area total em metros"
            keyboardType="numeric"
          />
        </View>
      )}

      {selectedCategory === 4 && (
        <View style={addImovel_style.containerFormInfo}>
          <Text style={addImovel_style.subtitle}>Informações Básicas</Text>
          <Dropdown
            style={addImovel_style.dropdown}
            placeholderStyle={addImovel_style.placeholderStyle}
            selectedTextStyle={addImovel_style.selectedTextStyle}
            inputSearchStyle={addImovel_style.inputSearchStyle}
            iconStyle={addImovel_style.iconStyle}
            data={typeStatusData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="qual o tipo de transação"
            value={typeStatus}
            onChange={(item) => {
              setTypeStatus(item.value);
            }}
          />

          <TextInput
            style={addImovel_style.input}
            onChangeText={setPrice}
            value={price}
            placeholder="Informe o preço"
            keyboardType="numeric"
          />
        </View>
      )}

      {selectedCategory === 2 && (
        <View style={addImovel_style.containerFormInfo}>
          <Text style={addImovel_style.subtitle}>Informações Básicas</Text>
          <View style={addImovel_style.containerCounters}>
            <Text style={addImovel_style.containerCountersText}>
              Numero de Quartos
            </Text>
            <View style={addImovel_style.counter}>
              <TouchableOpacity
                style={addImovel_style.counterBtn}
                onPress={() => incrementTotal("totalBedrooms")}
              >
                <Text style={addImovel_style.counterBtnText}>+</Text>
              </TouchableOpacity>
              <Text>{totalBedrooms}</Text>
              <TouchableOpacity
                style={addImovel_style.counterBtn}
                onPress={() => decrementTotal("totalBedrooms")}
              >
                <Text style={addImovel_style.counterBtnText}>-</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={addImovel_style.containerCounters}>
            <Text style={addImovel_style.containerCountersText}>
              Numero de WC
            </Text>
            <View style={addImovel_style.counter}>
              <TouchableOpacity
                style={addImovel_style.counterBtn}
                onPress={() => incrementTotal("totalWC")}
              >
                <Text style={addImovel_style.counterBtnText}>+</Text>
              </TouchableOpacity>
              <Text>{totalWC}</Text>
              <TouchableOpacity
                style={addImovel_style.counterBtn}
                onPress={() => decrementTotal("totalWC")}
              >
                <Text style={addImovel_style.counterBtnText}>-</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={addImovel_style.containerCounters}>
            <Text style={addImovel_style.containerCountersText}>
              Numero de Cosinhas
            </Text>
            <View style={addImovel_style.counter}>
              <TouchableOpacity
                style={addImovel_style.counterBtn}
                onPress={() => incrementTotal("totalChinken")}
              >
                <Text style={addImovel_style.counterBtnText}>+</Text>
              </TouchableOpacity>
              <Text>{totalChinken}</Text>
              <TouchableOpacity
                style={addImovel_style.counterBtn}
                onPress={() => decrementTotal("totalChinken")}
              >
                <Text style={addImovel_style.counterBtnText}>-</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Dropdown
            style={addImovel_style.dropdown}
            placeholderStyle={addImovel_style.placeholderStyle}
            selectedTextStyle={addImovel_style.selectedTextStyle}
            inputSearchStyle={addImovel_style.inputSearchStyle}
            iconStyle={addImovel_style.iconStyle}
            data={typeStatusData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="qual o tipo de transação"
            value={typeStatus}
            onChange={(item) => {
              setTypeStatus(item.value);
            }}
          />

          <TextInput
            style={addImovel_style.input}
            onChangeText={setPrice}
            value={price}
            placeholder="Informe o preço"
            keyboardType="numeric"
          />

          <TextInput
            style={addImovel_style.input}
            onChangeText={setTotalArea}
            value={totalArea}
            placeholder="Informe a Area total em metros"
            keyboardType="numeric"
          />
        </View>
      )}

      <View style={addImovel_style.containerFormInfo}>
        <Text style={addImovel_style.subtitle}>Adicione Imagens</Text>
        <View style={addImovel_style.containerPicture}>
          <TouchableOpacity
            style={addImovel_style.picture}
            onPress={pickImage01}
          >
            {image01 != null ? (
              <Image
                source={{ uri: image01 }}
                style={{ width: 150, height: 150 }}
              />
            ) : (
              <Text style={addImovel_style.pictureText}>+</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={addImovel_style.picture}
            onPress={pickImage02}
          >
            {image02 != null ? (
              <Image
                source={{ uri: image02 }}
                style={{ width: 150, height: 150 }}
              />
            ) : (
              <Text style={addImovel_style.pictureText}>+</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={addImovel_style.picture}
            onPress={pickImage03}
          >
            {image03 != null ? (
              <Image
                source={{ uri: image03 }}
                style={{ width: 150, height: 150 }}
              />
            ) : (
              <Text style={addImovel_style.pictureText}>+</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={addImovel_style.picture}
            onPress={pickImage04}
          >
            {image04 != null ? (
              <Image
                source={{ uri: image04 }}
                style={{ width: 150, height: 150 }}
              />
            ) : (
              <Text style={addImovel_style.pictureText}>+</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={{ marginBottom: 40 }}>
          <Button
            name={"Hospedar"}
            bgColor={"#094559"}
            textColor={"#fff"}
            onPress={() => {
              submitImovelData();
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
