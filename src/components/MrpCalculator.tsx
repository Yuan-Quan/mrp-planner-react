import * as React from "react";
import { IDependency, IPeriod, IPeriodItem, IProduct, IStockItem } from "../MrpData";
import { AppContext } from "../App";

export const calculateMrpChainOfProduct = (targetProducts: IProduct[], normalProducts: IProduct[], product_idx: number) => {

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
        createPeriodItem(targetProducts[product_idx]),
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
      periods[currentPeriod].items.forEach((item) => {
        if (currentPeriod + findProductByIdx(item.idx)!.lead_time >= periods.length) {
          console.log(item.name, "order query out of range, skip")
          return; // use return instead of continue
        }
        console.log("od", periods[currentPeriod + findProductByIdx(item.idx)!.lead_time].items.find((item) => item.idx == item.idx)!.order)
        console.log("gr", item.gross_requirement)
        if (periods[currentPeriod + findProductByIdx(item.idx)!.lead_time].items.find((to_order) => to_order.idx == item.idx)!.order >= item.gross_requirement) {
          console.log(item.name, "Already ordered, skip")
        }
        else {
          console.log(item.name, "not satisfied, ordering" + item.gross_requirement + "of" + item.name + "at" + (currentPeriod + findProductByIdx(item.idx)!.lead_time))
          periods[currentPeriod + findProductByIdx(item.idx)!.lead_time].items.find((to_order) => to_order.idx == item.idx)!.order = item.gross_requirement
        }
      })
    }
    console.log("propagetOrderOnce complete", periods)
  }

  const propagateGrossRequirementOnce = () => {
    for (let currentPeriod = 0; currentPeriod < periods.length; currentPeriod++) {
      periods[currentPeriod].items.forEach((item) => {
        if (item.order == 0) {
          //console.log(item.name, currentPeriod, "no order skip", item.order)
        }
        else {
          //  find dependency of this item
          //console.log(item.name, "has order, resolve dependency")
          findProductByIdx(item.idx)!.dependencies.map((dep) => {
            if (periods[currentPeriod].items.find((item) => item.idx == dep.deps_idx)!.gross_requirement >= item.order * dep.ratio) {
              //console.log(findProductByIdx(dep.deps_idx)!.name, "gross already satisfied")
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
      console.log("at period", currentPeriod)
      periods[currentPeriod].items.forEach((item) => {
        if (item.order == 0) {
          console.log(item.name, currentPeriod, "no order skip", item.order)
        }
        else {
          console.log(item.name, "has order, resolve inbound")
          if (periods[currentPeriod - findProductByIdx(item.idx)!.lead_time].items.find((to_inbound) => to_inbound.idx == item.idx)!.inbound >= item.order) {
            console.log(item.name, "inbound already satisfied")
          } else {
            console.log(item.name, "inbound not satisfied, adding inbound")
            periods[currentPeriod - findProductByIdx(item.idx)!.lead_time].items.find((to_inbound) => to_inbound.idx == item.idx)!.inbound = item.order
          }

        }
      })
    }
    console.log("propagateInboundOnce complete", periods)
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
    return unsatisfiedCount
  }

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


  // populatete the periods, 10 should be plenty
  for (let i = 0; i < 10; i++)
    periods.push(createPeriod(0));
  // set the gross requirement of the target product in the last period
  periods[0].items[0].gross_requirement =
    targetProducts[product_idx].target_stock || 0; // 0 to suppress the ts error

  // calculate the MRP chain
  var unsatisfiedCount = 1
  while (unsatisfiedCount > 0) {
    propagetOrderOnce()
    propagateGrossRequirementOnce()
    propagateInboundOnce()
    unsatisfiedCount = calcuateUnsatisfiedCount()
    console.log("=====================================")
    console.log("unsatisfiedCount", unsatisfiedCount)
  }
  return periods;
};

