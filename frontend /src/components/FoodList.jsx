import { Button, Card, List, message, Select, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { addItemToCart, getMenus, getRestaurants } from "../utils";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddToCartButton = ({ itemId }) => {
  const [loading, setLoading] = useState(false);

  const AddToCart = () => {
    setLoading(true);
    addItemToCart(itemId)
      .then(() => message.success(`Successfully add item`))
      .catch((err) => message.error(err.message))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Tooltip title="Add to shopping cart">
      <Button
        loading={loading}
        type="primary"
        icon={<PlusOutlined />}
        onClick={AddToCart}
      />
    </Tooltip>
  );
};

const FoodList = () => {
  /*
  1. state for current restaurant
  2. state for the food of selected restaurant
  3. state for loading
  4. state for all the restaurants (only set the state once)
  */
  const [foodData, setFoodData] = useState([])
  const [curRest, setCurRest] = useState()
  const [restaurants, setRestaurants] = useState([])
  const [loadingFood, setLoadingFood] = useState(false)
  const [loadingRest, setLoadingRest] = useState(false)

  useEffect(() => {
    setLoadingRest(true)
    getRestaurants()
      .then((data) => {
        setRestaurants(data)
      })
      .catch((error) => {
        message.error(error.message)
      })
      .finally(() => {
        setLoadingRest(false)
      })
  }, [])
  // [] means we will call useEffect() when componentDidMount

  useEffect(() => {
    // curRest not null && not undefined
    if (curRest) {
      setLoadingFood(true)
      getMenus(curRest)
        .then((data) => {
          setFoodData(data)
        })
        .catch((error) => {
          message.error(error.message)
        })
        .finally(() => {
          setLoadingFood(false)
        })
    }
  }, [curRest])
  // [curRest] means we will call useEffect() when componentDidUpdate

  return (
    <>
      <Select
        value={curRest}
        onSelect={(value) => setCurRest(value)}
        placeholder="Select a restaurant"
        loading={loadingRest}
        style={{ width: 300 }}
        onChange={(value) => setCurRest(value)}
      >
        {restaurants.map((item) => {
          return <Option key={item.id} value={item.id}>{item.name}</Option>;
        })}
      </Select>
      {curRest && (
        <List
          style={{ marginTop: 20 }}
          loading={loadingFood}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 3,
            xxl: 3,
          }}
          dataSource={foodData}
          renderItem={(item) => (
            <List.Item>
              <Card
                title={item.name}
                extra={<AddToCartButton itemId={item.id} />}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{ height: 340, width: "100%", display: "block" }}
                />
                {`Price: ${item.price}`}
              </Card>
            </List.Item>
          )}
        />
      )}
    </>
  );
  
}


export default FoodList;