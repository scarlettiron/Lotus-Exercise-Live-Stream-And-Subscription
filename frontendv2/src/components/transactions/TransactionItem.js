import React from 'react'
import { convertToFormattedSiteDate } from '../../utils/DateFunctions'
import '../../css/transactions.css'
import '../../css/general.css'

const getPrice = (units) => {
  const amount = units / 100
  return amount.toFixed(2)
}

const getTypeLink = (t) => {
  if(t.post){
    return {type:'Post', link:`/post/${t.post}`}
  }
  if(t.subscription){
    return {type:'Subscription', link:`/user/${t.subscription.creator}`}
  }
  if(t.classPackage){
    return {type:'Class', link:`/user/${t.classPackage.user}`}
  }
}

const TransactionItem = React.memo(({transaction}) => {
  const {type, link} = getTypeLink(transaction)
  return (
    <div className='w-100 t-item-wrapper'>
        <div className='display-inline t-desc'>
          <p>{convertToFormattedSiteDate(transaction.date)}</p>
        </div>
        <div className='display-inline t-desc'>
          {transaction.is_purchase ?
            <p>{type} purchase</p>
            : <p>{type} Payment</p>
          }
        </div>
        <div className='display-inline t-desc'>
          {transaction.is_purchase ?
              <p className='text-purchase'>-${getPrice(transaction.units)}</p>
              : <p className='text-payment'>+${getPrice(transaction.units)}</p>
            }
        </div>
    </div>
  )
})

export default TransactionItem