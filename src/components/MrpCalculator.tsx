import * as React from "react";
import { IDependency, IPeriod, IPeriodItem, IProduct, IStockItem } from "../MrpData";
import { AppContext } from "../App";

export const calculateMrpChainOfProduct = (targetProducts: IProduct[], normalProducts: IProduct[]) => {

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
      isOrderGenerated: false,
      isGRGenerated: false,
      isInboundGenerated: false,
    };
  };
  // create a empty period
  const createPeriod = (idx: number) => {
    return {
      items: [
        ...targetProducts.map(createPeriodItem),
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
    for (let currentPeriod = periods.length - 1; currentPeriod > 0; currentPeriod--) {
      periods[currentPeriod].items.forEach((item) => {
        if (item.gross_requirement == 0) {
          console.log(item.name, "no need to order, skip")
          return;
        }
        if (item.isOrderGenerated) {
          console.log(item.name, "Already ordered, skip")
        }
        else {
          console.log(item.name, "not satisfied, ordering " + item.gross_requirement + " of " + periods[currentPeriod - findProductByIdx(item.idx)!.lead_time].items.find((to_order) => to_order.idx == item.idx)!.name + "at" + (currentPeriod + findProductByIdx(item.idx)!.lead_time))
          periods[currentPeriod - findProductByIdx(item.idx)!.lead_time].items.find((to_order) => to_order.idx == item.idx)!.order += item.gross_requirement
          item.isOrderGenerated = true
        }
      })
    }
    console.log("propagetOrderOnce complete", periods)
  }

  const propagateGrossRequirementOnce = () => {
    for (let currentPeriod = periods.length - 1; currentPeriod > 0; currentPeriod--) {
      periods[currentPeriod].items.forEach((item) => {
        if (item.order == 0) {
          console.log(item.name, currentPeriod, "no order skip")
        }
        else {
          if (item.isGRGenerated) {
            console.log(item.name, "gross already generated")
          }
          else {
            console.log(item.name, "has order, resolve dependency")
            findProductByIdx(item.idx)!.dependencies.map((dep) => {
              periods[currentPeriod].items.find((item) => item.idx == dep.deps_idx)!.gross_requirement += item.order * dep.ratio
            })
            item.isGRGenerated = true;
          }
        }
      })
    }
    console.log("propagateGrossRequirementOnce complete", periods)
  }

  const propagateInboundOnce = () => {
    for (let currentPeriod = periods.length - 1; currentPeriod > 0; currentPeriod--) {
      console.log("at period", currentPeriod)
      periods[currentPeriod].items.forEach((item) => {
        if (item.order == 0) {
          console.log(item.name, currentPeriod, "no order skip", item.order)
        }
        else {
          console.log(item.name, "has order, resolve inbound")
          if (item.isInboundGenerated) {
            console.log(item.name, "inbound already satisfied")
          } else {
            if (findProductByIdx(item.idx)!.minimal_order_quantity > item.order) {
              console.log("minimal order quantity not reached, padding to minimal order quantity")
              item.order = findProductByIdx(item.idx)!.minimal_order_quantity
            }
            console.log(item.name, "inbound not satisfied, adding inbound")
            periods[currentPeriod + findProductByIdx(item.idx)!.lead_time].items.find((to_inbound) => to_inbound.idx == item.idx)!.inbound = item.order
            item.isInboundGenerated = true;
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


  // populatete the periods, assume target period is sufficient
  var max_target_period = 0
  targetProducts.map((product) => {
    if (product.target_periode! > max_target_period) {
      max_target_period = product.target_periode!
    }
  });

  // for some unknown reason, the following code will cause this thing to stuck in a infinite loop
  // for (let i = 0; i < max_period_count + 1; i++) {
  // so used a static number instead, 100 should be plenty
  for (let i = 0; i < 100; i++) {
    periods.push(createPeriod(i));
  }

  // set the gross requirement of the target product in the expected period
  // +10 is a workaround for running out of array index
  targetProducts.map((target, idx) => {
    periods[target.target_periode! + 10].items[idx].gross_requirement = targetProducts[idx].target_stock || 0; // 0 to suppress the ts error
  })
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
  return periods.slice(10, max_target_period + 11);
};

// cut off the periods that are not needed
const trimPeriods = (periods: IPeriod[]) => {
  const isMeaningful = (period: IPeriod) => {
    let meaningful = false
    period.items.forEach((item) => {
      if (item.gross_requirement != 0 || item.inbound != 0 || item.order != 0) {
        meaningful = true
      }
    })
    return meaningful
  }

  let last_period_idx = 0
  periods.map((period, index) => {
    if (isMeaningful(period)) {
      last_period_idx = index
    }
  });

  return periods.slice(0, last_period_idx + 1)
}

const mergePeriods = (periodss: any) => {

}

