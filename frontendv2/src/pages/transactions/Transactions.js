import React, {useState, useRef, useEffect, useCallback} from 'react'
import CustomFetch from '../../utils/CustomFetch'
import { transactionsUrls } from '../../utils/BaseInfo'
import LoadingSpinner from '../../components/general/LoadingSpinner'
import TransactionItem from '../../components/transactions/TransactionItem'
import Button5 from '../../components/general/Button5'
import GeneralHeader from '../../components/general/headers/GeneralHeader'

import '../../css/general.css'
import '../../css/transactions.css'



const Transactions = React.memo(() => {
    const {transactionsList} = transactionsUrls

    const [loading, setLoading] = useState(() => true)
    const [transactions, setTransactions] = useState(()=>null)
    const [all, setAll] = useState(()=>true)
    const [purchases, setPurchases] = useState(()=>false)
    const [payments, setPayments] = useState(()=>false)


    const handleGetTransactions = useCallback(async () => {
        const fetchConfig = {method:'GET'}
        const {response, data} = await CustomFetch(transactionsList.url, fetchConfig)
        if(response.status === 200){
            setTransactions(() => data)
            setLoading(() => false)
        }
    }, [transactionsList.url])

    const handlePaginateTransactions = useCallback(async () => {
        const fetchConfig = {method:'GET'}
        const {response, data} = await CustomFetch(transactions.next, fetchConfig)
        if(response.status === 200){
            setTransactions(oldArray => ({
                ...oldArray, results:[...oldArray.results, ...data.results], 
                next:data.next, previous:data.previous}))
        }
    }, [setTransactions, transactions])

    const observer = useRef()

    const handleTrackPosition = element => {
      if(!transactions.next) return
      if(observer.current) {observer.current.disconnect()}
      observer.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting){
          handlePaginateTransactions()
        }
      })
      if(element) {observer.current.observe(element)}
    }

    const viewAll = useCallback(() => {
        setPurchases(() => false)
        setPayments(() => false)
        setAll(() => true)
    },[setAll])

    const viewPurchases = useCallback(() => {
        console.log('setting purchases')
        setPayments(() => false)
        setAll(() => false) 
        setPurchases(() => true)
    }, [setPurchases])

    const viewPayments = useCallback(() => {
        console.log('veiwing payments')
        setPurchases(() => false)
        setAll(() => false)
        setPayments(() => true)
    },[setPayments])

    useEffect(() => {
        console.log('useEffect running')
        handleGetTransactions()
    }, [handleGetTransactions])

  return (
    <div className='container'>
        <GeneralHeader text='Transactions' />
        {loading && <LoadingSpinner/>}

        <div className='justify-content-space-around padding-20'>
            <Button5 
            text={'All'} 
            action={viewAll} 
            btnClass={all ? 'active' : null}
            />
            <Button5 
            text={'Purchases'} 
            action={viewPurchases} 
            btnClass={purchases ? 'active' : null}
            />
            <Button5 
            text={'Payments'} 
            action={viewPayments} 
            btnClass={payments ? 'active' : null}
            />
        </div>
        <div className='t-items-container'>
            {transactions && transactions.count > 0 &&
                transactions.results.map((t, index, tArray) => {
                    if (index + 1 === transactions.results.length && transactions.next){
                        return <>
                            {all && <TransactionItem key={index} transaction={t}/>}
                            {payments && t.is_payment && <TransactionItem key={index} transaction={t}/>}
                            {purchases && t.is_purchase && <TransactionItem key={index} transaction={t}/>}
                            <div ref={handleTrackPosition}></div>
                            </>
                    }
                    return <>
                        {all && <TransactionItem key={index} transaction={t}/>}
                        {payments && t.is_payment && <TransactionItem key={index} transaction={t}/>}
                        {purchases && t.is_purchase && <TransactionItem key={index} transaction={t}/>}
                        </>
                })
            }
        </div> 
    </div>
  )
})

export default Transactions