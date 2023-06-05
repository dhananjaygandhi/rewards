import React, { useState, useEffect } from "react";
import getConfig from 'next/config';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { useRouter } from 'next/router';
import _get from 'lodash/get';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import algoliaSearchApi from '../pages/api/algoliaObject';
import { useUser } from '@supabase/auth-helpers-react';
import { supabaseConnection } from '../utils/supabase';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const { publicRuntimeConfig } = getConfig();

export async function getServerSideProps({req, res}) {
  const supabaseServerClient = createServerSupabaseClient({
    req,
    res,
  })
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();

  const loggedinUserId = _get(user, 'id', '');

  const supabase = supabaseConnection();
  const { data: shukran, error } = await supabase.rpc('myshukranpoints', {emp_uuid: _get(user, 'id', '')});

  const { data: used_rewards, error: urewardsError } = await supabase
  .from('used_rewards')
  .select('*')
  .or(`uuid.eq.${loggedinUserId},assignee_uuid.eq.${loggedinUserId}`)

  const rewards_transaction = used_rewards.reduce((reduced, item) => {
    if(item.uuid === _get(user, 'id')) {
      return {
        ...reduced,
        accepted: reduced.donated + item.points
      };
    }
    if(item.assignee_uuid === _get(user, 'id')) {
      return {
        ...reduced,
        donated: reduced.donated + item.points
      };
    }
    return reduced;
  }, {accepted: 0, donated: 0});

  const availableShukran = _get(shukran, '0.sum', 0) + _get(rewards_transaction, 'accepted', 0) - _get(rewards_transaction, 'donated', 0);

  return {props: {shukran, used_rewards, availableShukran}};
}

export default function Product(props) {
  const router = useRouter();
  const user = useUser();
  const pid = _get(router, 'query.pid', '');
  const [product, setProduct] = useState([]);
  const [status, setStatus] = useState(false);
  const availableShukran = _get(props, "availableShukran", 0);
  const conversion = _get(publicRuntimeConfig, 'conversion.shukran', 1000);

  useEffect(() => {
    const algolia = algoliaSearchApi({pid: pid});
      algolia.then(
        function(value) {
          setProduct(_get(value, "hits.0", []))
        },
        function(error) {
          console.log(error);
        }
      );
  }, []);

  const btnClick = () => {
    setStatus(true);
  }

  const handleClose = () => {
    setStatus(false);
  }

  return (
    <>
      <h2>
      <p>Total available shukran points: {availableShukran}</p>
      </h2>
      <Grid container spacing={2}>
        <Grid item sm={4} xs={12}>
          <img src={product['333WX493H']} width="100%" />
        </Grid>
        <Grid item sm={8} xs={12}>
          <h2>
            {_get(product, "name.en", "")}
          </h2>
          <p className="prod-price">
            {_get(product, "price", "") * conversion} Shukran
          </p>
          <Button variant="contained" onClick={btnClick}>Buy Now</Button>
        </Grid>
      </Grid>
      <Snackbar open={status} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
          This is a dummy page!
        </Alert>
      </Snackbar>
    </>
  )
}