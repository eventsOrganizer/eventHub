import * as React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase-client';
import { ServicesTable } from './services-table'

export function PersonalServices(): React.JSX.Element {
  const [personalServices, setPersonalServices] = useState([]);

  useEffect(() => {
    fetchPersonalServices();
  }, []); 

  const fetchPersonalServices = async () => {
    const { data, error } = await supabase
      .from('personal')
      .select('*');

    if (error) {
      console.error('Error fetching personal services:', error);
    } else {
      setPersonalServices(data);
    }
  };

  return (
    <div>
      <h2>Personal Services</h2>
      <ServicesTable services={personalServices} />
    </div>
  );
}