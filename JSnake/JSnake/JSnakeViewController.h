//
//  JSnakeViewController.h
//  JSnake
//
//  Created by Joe Crozier on 2015-10-15.
//  Copyright © 2015 Joe Crozier. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface JSnakeViewController : UIViewController

@property IBOutlet UIView *gameBoardView;

- (IBAction)directionButtonPressed:(id)sender;

- (void)updateBlocks: (NSArray *)blocks;

@end
