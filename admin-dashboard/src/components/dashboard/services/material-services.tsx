import * as React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase-client';
import { ServicesTable } from './services-table';

export function MaterialServices(): React.JSX.Element {
  const [materialServices, setMaterialServices] = useState([]);

  useEffect(() => { 
    fetchMaterialServices();
  }, []);

  const fetchMaterialServices = async () => {
    const { data, error } = await supabase
      .from('material')
      .select('*');

    if (error) {
      console.error('Error fetching material services:', error);
    } else {
      setMaterialServices(data);
    }
  };

  return (
    <div>
      <h2>Material Services</h2>
      <ServicesTable services={materialServices} />
    </div>
  );
}