import React, { useEffect } from 'react';
import { Device } from '@capacitor/device';

const DeviceIdentifier: React.FC = () => {
  useEffect(() => {
    Device.getId()
      .then(deviceId => {
        const uniqueId = deviceId + '_' + Date.now().toString();
        console.log('Identificador único:', deviceId);
      })
  
  }, []);

  return null;
};

export default DeviceIdentifier;
