//
//  RNSettings.h
//  EnableServiceLocator
//
//  Created by Rajat Marecl Beck on 23/06/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

@interface RNSettings : NSObject <RCTBridgeModule>

@end
