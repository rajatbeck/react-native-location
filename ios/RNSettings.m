//
//  RNSettings.m
//  EnableServiceLocator
//
//  Created by Rajat Marecl Beck on 23/06/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNSettings.h"

#import "UIKit/UIKit.h"
#import <Foundation/NSURL.h>
#import <CoreLocation/CoreLocation.h>

@implementation RNSettings

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()


RCT_REMAP_METHOD(enableLocationService,
                 onPermissionGiven:(RCTResponseSenderBlock)successCallback
                 onPermissionDenied:(RCTResponseSenderBlock)errorCallback)
{
    CLAuthorizationStatus status = [CLLocationManager authorizationStatus];

    if (![CLLocationManager locationServicesEnabled]) {
        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"App-Prefs:root=Privacy&path=LOCATION"] options:@{}
                                 completionHandler:^(BOOL success) {}];

    } else if (status == kCLAuthorizationStatusDenied) {
        NSLog(@"Location Services Disabled");

        // show location settings
        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:UIApplicationOpenSettingsURLString] options:@{}
                                 completionHandler:^(BOOL success) {}];

    } else {
        NSLog(@"Location Services Enabled");
        successCallback(@[[NSNull null]]);
    }
}


RCT_REMAP_METHOD(isLocationEnabled,
                 onLocationEnabled:(RCTResponseSenderBlock)successCallback
                 onLocationDisable:(RCTResponseSenderBlock)errorCallback)
{
    CLAuthorizationStatus status = [CLLocationManager authorizationStatus];

    if (![CLLocationManager locationServicesEnabled] || status == kCLAuthorizationStatusDenied) {
        NSLog(@"Location Services Disabled");
        errorCallback(@[[NSNull null]]);
    } else {
        NSLog(@"Location Services Enabled");
        successCallback(@[[NSNull null]]);
    }
}


@end
