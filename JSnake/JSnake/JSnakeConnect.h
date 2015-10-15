//
//  JSnakeConnect.h
//  JSnake
//
//  Created by Joe Crozier on 2015-10-15.
//  Copyright © 2015 Joe Crozier. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "JSnake-Bridging-Header.h"
#import "JSnake-Swift.h"

@interface JSnakeConnect : NSObject

@property SocketIOClient *socket;
@property NSArray *latestBlocks;
@property NSNumber *id;
@property (copy)void (^updateBlocks)(NSArray *blocks);


- (void)connectToServerWithCompletion:(void (^)(BOOL finished))completion;
- (void)directionPressed: (NSString *)direction;


@end
