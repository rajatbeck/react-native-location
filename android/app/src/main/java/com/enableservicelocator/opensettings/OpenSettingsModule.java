package com.enableservicelocator.opensettings;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.provider.Settings;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.PermissionChecker;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.location.GpsStatus;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.content.IntentFilter;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class OpenSettingsModule extends ReactContextBaseJavaModule{

 private final ReactApplicationContext reactContext;
 private static final String EVENT_STATUS_CHANGE = "OnStatusChange";
 private Boolean isReceive = false;
 private BroadcastReceiver mGpsSwitchStateReceiver = null;

  @Override
  public String getName() {
    /**
     * return the string name of the NativeModule which represents this class in JavaScript
     * In JS access this module through React.NativeModules.OpenSettings
     */
    return "OpenSettings";
  }

  @ReactMethod
      public void isLocationEnabled(Callback successCallback, Callback errorCallback) {
          LocationSwitch.getInstance().isLocationEnabled(getCurrentActivity(),
                  successCallback, errorCallback);
      }

      @ReactMethod
      public void enableLocationService(int interval, boolean requestHighAccuracy,
                                        Callback successCallback, Callback errorCallback) {
          LocationSwitch.getInstance().setup(
                  successCallback, errorCallback, interval, requestHighAccuracy);
          LocationSwitch.getInstance().displayLocationSettingsRequest(
                  getCurrentActivity());
      }


      private void sendEvent() {
              if (isReceive) {
                  LocationManager locationManager = (LocationManager) getCurrentActivity().getSystemService(Context.LOCATION_SERVICE);
                  WritableMap params = Arguments.createMap();
                  if (locationManager != null) {
                      boolean enabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);

                      params.putString("status", (enabled ? "enabled" : "disabled"));
                      params.putBoolean("enabled", enabled);

                      ReactContext reactContext = getReactApplicationContext();

                      if (reactContext != null) {
                          reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("locationProviderStatusChange", params);
                      }
                  }
              }
          }


      /**
       * ActivityEventListener methods
       **/
      public void onNewIntent(Intent intent) {

      }



      @ReactMethod
      	public void _startListen() {
      		_stopListen();

      		try {
      			mGpsSwitchStateReceiver = new GPSProvideChangeReceiver();
      			getReactApplicationContext().registerReceiver(mGpsSwitchStateReceiver, new IntentFilter(LocationManager.PROVIDERS_CHANGED_ACTION));
      			isReceive = true;
      		}catch(Exception ex){}
      	}

      	@ReactMethod
      	public void _stopListen() {
      		isReceive = false;
      		try {
      			//locationManager.removeGpsStatusListener(this);
      			if (mGpsSwitchStateReceiver != null) {
      				getReactApplicationContext().unregisterReceiver(mGpsSwitchStateReceiver);
      				mGpsSwitchStateReceiver = null;
      			}
      		}catch(Exception ex){}
      	}



  @ReactMethod
    public void open() {
        Intent intent = new Intent();
        intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        Uri uri = Uri.fromParts("package", reactContext.getPackageName(), null);
        intent.setData(uri);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactContext.startActivity(intent);
    }

    @ReactMethod
    public void openSetting(){
     Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
     intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
     reactContext.startActivity(intent);

   }

  /* constructor */
  public OpenSettingsModule(ReactApplicationContext reactContext) {
    super(reactContext);
     this.reactContext = reactContext;
  }


    private final class GPSProvideChangeReceiver extends BroadcastReceiver {

    		@Override
    		public void onReceive(Context context, Intent intent) {
    			String action = intent.getAction();
    			if (action.matches("android.location.PROVIDERS_CHANGED")) {

    				sendEvent();
    			}
    		}
    	}

}