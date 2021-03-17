import HubApi from '@nimiq/hub-api';
import { useCallback, useEffect, useState } from 'react';

const hubApi = new HubApi('https://hub.nimiq-testnet.com');

const hashCode = s => s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)

const App = () => {

  const [userName, setUserName] = useState('');
  const [signedIn, setSignedIn] = useState(false);
  const [subscribed, setSubscribed] = useState(null);
  
  useEffect(() => {
    signedIn &&
      fetch('https://test-api.nimiq.watch/account/NQ96LFM4S13H7HU52UX1AQQDL2F4CNRQYPJ5')
        .then(res => res.json().then(account => {
          setSubscribed(account.transactions.some(t => atob(t.data) === String(hashCode(userName))))
        }))
  }, [userName, signedIn])

  const purchaseMembership = useCallback(() => 
    hubApi.checkout({
          appName: 'Nimiq React Example',
          recipient: 'NQ96 LFM4 S13H 7HU5 2UX1 AQQD L2F4 CNRQ YPJ5',
          value: 3.14 * 1e5, // 3.14 NIM
          extraData: String(hashCode(userName))
        }).then(signedTransaction => signedTransaction && setSubscribed(true))
  , [userName])
  
  return signedIn 
    ? <div>
        Welcome <b>{userName}</b><br/>
        {
          subscribed === null 
            ? "Querying membership status..."
            : subscribed === false
              ? <>Free Content <br/><button onClick={purchaseMembership}>Purchase Membership</button></>
              : <>Premium Content <br/></>
        }
        <button onClick={() => setSignedIn(false)}>Log out</button>
      </div>
    : <div>
        Please enter your username:
        <input onChange={e => setUserName(e.target.value)}/>
        <button onClick={() => setSignedIn(true)} disabled={!userName}>Log in</button>
      </div>
}


export default App;