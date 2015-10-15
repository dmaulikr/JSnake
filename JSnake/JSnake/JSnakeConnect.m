//
//  JSnakeConnect.m
//  JSnake
//
//  Created by Joe Crozier on 2015-10-15.
//  Copyright © 2015 Joe Crozier. All rights reserved.
//

#import "JSnakeConnect.h"

@implementation JSnakeConnect

- (void)connectToServerWithCompletion:(void (^)(BOOL finished))completion{
    self.socket = [[SocketIOClient alloc] initWithSocketURL:@"http://192.168.0.13:5252" opts:nil];
    [self.socket on:@"connect" callback:^(NSArray * _Nonnull data, SocketAckEmitter * _Nullable ack) {
        completion(YES);
        //Server sends us our ID which we will be sending back
        [self setUpHandlers];
    }];
    [self.socket connect];
}

- (void)setUpHandlers {
    [self.socket emit:@"requestId" withItems:@[]];
    
    [self.socket on:@"id" callback:^(NSArray * _Nonnull data, SocketAckEmitter * _Nullable ack) {
        self.id = data[0][@"id"];
    }];
    
    [self.socket on:@"board" callback:^(NSArray * _Nonnull data, SocketAckEmitter * _Nullable ack) {
        self.updateBlocks(data[0][@"board"]);
    }];
    
}

- (void)directionPressed: (NSString *)direction {
    //Send the direction along with our ID
    [self.socket emit:@"direction" withItems:@[
                                               @{
                                                   @"direction": direction,
                                                   @"id": self.id
                                                   }]];
}



@end
