import * as React from "react";
import { IDependency, IPeriod, IPeriodItem, IProduct, IStockItem } from "../MrpData";
import { AppContext } from "../App";

export const CalculateMrpChainOfProduct = (props: any) => {
  const {
    targetProducts,
    setTargetProducts,
    normalProducts,
    setNormalProducts,
  } = React.useContext(AppContext);

  let periods: IPeriod[] = []; // the periods of the MRP chain from end to start
  let stock: IStockItem[] = []; // the stock of the MRP chain from end to start

  // populate the stock
  targetProducts.map((product) => {
    stock.push({
      idx: product.idx,
      name: product.name,
      amount: product.inital_stock,
    });
  });
  normalProducts.map((product) => {
    stock.push({
      idx: product.idx,
      name: product.name,
      amount: product.inital_stock,
    });
  });

  // we will offset the current period to the target period, after we have calculated the whole chain
  //create a empty period item
  const findProductByIdx = (idx: number) => {
    return [...targetProducts, ...normalProducts].find((product) => product.idx == idx)
  }
  const createPeriodItem = (product: IProduct) => {
    return {
      idx: product.idx,
      name: product.name,
      gross_requirement: 0,
      stock: 0,
      inbound: 0,
      order: 0,
    };
  };
  // create a empty period
  const createPeriod = (idx: number) => {
    return {
      items: [
        createPeriodItem(targetProducts[props.product_idx]),
        ...normalProducts.map(createPeriodItem),
      ],
    };
  };

  // check if gross requirement is satisfied
  const isSatisfied = (item: IPeriodItem) => {
    return item.stock + item.inbound >= item.gross_requirement;
  }

  // check if order is satisfied
  const isOrderSatisfied = (item: IPeriodItem) => {
    return item.stock + item.inbound >= item.order;
  }

  const propagetOrderOnce = () => {
    for (let currentPeriod = 0; currentPeriod < periods.length; currentPeriod++) {
      console.log("currentPeriodpre", currentPeriod)
      periods[currentPeriod].items.forEach((item) => {
        if (currentPeriod + findProductByIdx(item.idx)!.lead_time >= periods.length) {
          console.log(item.name, "order query out of range, skip")
          return; // use return instead of continue
        }
        if (periods[currentPeriod + findProductByIdx(item.idx)!.lead_time].items.find((item) => item.idx == item.idx)!.order >= item.gross_requirement) {
          console.log(item.name, "skip")
        }
        else {
          console.log(item.name, "not satisfied, ordering")
          console.log("currentPeriodpost", currentPeriod)
          console.log(periods)
          periods[currentPeriod + findProductByIdx(item.idx)!.lead_time].items.find((item) => item.idx == item.idx)!.order = item.gross_requirement
        }
      })
    }
    console.log("propagetOrderOnce complete", periods)
  }

  const propagateGrossRequirementOnce = () => {
    for (let currentPeriod = 0; currentPeriod < periods.length; currentPeriod++) {
      periods[currentPeriod].items.forEach((item) => {
        if (item.order == 0) {
          console.log(item.name, currentPeriod, "no order skip", item.order)
        }
        else {
          //  find dependency of this item
          console.log(item.name, "has order, resolve dependency")
          findProductByIdx(item.idx)!.dependencies.map((dep) => {
            if (periods[currentPeriod].items.find((item) => item.idx == dep.deps_idx)!.gross_requirement >= item.order * dep.ratio) {
              console.log(findProductByIdx(dep.deps_idx)!.name, "gross already satisfied")
            }
            else {
              periods[currentPeriod].items.find((item) => item.idx == dep.deps_idx)!.gross_requirement = item.order * dep.ratio
            }
          })
        }
      })
    }
    console.log("propagateGrossRequirementOnce complete", periods)
  }

  const propagateInboundOnce = () => {
    for (let currentPeriod = 0; currentPeriod < periods.length; currentPeriod++) {

    }
  }

  const calcuateUnsatisfiedCount = () => {
    let unsatisfiedCount = 0
    for (let i = 0; i < periods.length; i++) {
      periods[i].items.forEach((item) => {
        if (!isSatisfied(item)) {
          unsatisfiedCount++
        }
      })
    }
  }
  // populatete the periods, 10 should be plenty
  for (let i = 0; i < 10; i++)
    periods.push(createPeriod(0));
  // set the gross requirement of the target product in the last period
  periods[0].items[0].gross_requirement =
    targetProducts[props.product_idx].target_stock || 0; // 0 to suppress the ts error

  // calculate the MRP chain
  var unsatisfiedCount = 1

  propagetOrderOnce()
  propagateGrossRequirementOnce()

  return <div></div>;
};
