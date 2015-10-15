//
//  JSnakeViewController.m
//  JSnake
//
//  Created by Joe Crozier on 2015-10-15.
//  Copyright © 2015 Joe Crozier. All rights reserved.
//

#import "JSnakeViewController.h"
#import "JSnakeConnect.h"

#define GAME_SIZE 15


@interface JSnakeViewController ()

//2D array of every block view
@property NSMutableArray *blockViews;
@property JSnakeConnect *jSnakeConnect;
@property NSMutableDictionary *snakesDictionary;


@end

@implementation JSnakeViewController

- (void)viewDidLoad {
    
    self.jSnakeConnect = [[JSnakeConnect alloc] init];
    
    [self.jSnakeConnect connectToServerWithCompletion:^(BOOL finished) {
        if (finished) {
            __weak typeof(self) weakSelf = self;
            [self.jSnakeConnect setUpdateBlocks:^(NSArray *blocks) {
                [weakSelf updateBlocks:blocks];
            }];
            [self drawBlocks];
        }
    }];

    
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}

- (void)updateBlocks:(NSArray *)blocks {
    int i = -1;
    for (NSArray *blocksRow in blocks) {
        i++;
        int j = -1;
        for (NSNumber *blockNumber in blocksRow){
            j++;
            UIView *blockView = self.blockViews[i][j];

            if ([blockNumber isEqual:[NSNull null]]) {
                //Only set the background colour if it needs to be changed
                if (blockView.backgroundColor != [UIColor whiteColor]) {
                    blockView.backgroundColor = [UIColor whiteColor];
                }
            }
            //Us
            else if ([blockNumber isEqualToNumber:self.jSnakeConnect.id]) {
                if (blockView.backgroundColor != [UIColor blueColor]) {
                    blockView.backgroundColor = [UIColor blueColor];
                }
            }
            //Apple
            else if ([blockNumber isEqualToNumber:@(0)]) {
                if (blockView.backgroundColor != [UIColor greenColor]) {
                    blockView.backgroundColor = [UIColor greenColor];
                }
            }
            //Any other snake
            else {
                if (blockView.backgroundColor != [UIColor redColor]) {
                    blockView.backgroundColor = [UIColor redColor];
                }
            }
        }
    }
}

- (void)drawBlocks {
    
    self.blockViews = [[NSMutableArray alloc] init];
    CGRect viewFrame = self.gameBoardView.frame;
    CGFloat blockSize = viewFrame.size.width / GAME_SIZE - 5.5;
    //Create a UIView for every block on the playing field
    for (int i = 0; i < GAME_SIZE; i++) {
        CGFloat blockYOffset = i * blockSize + i*5 + 5;
        //Array to store the views in that row
        NSMutableArray *rowViewArray = [[NSMutableArray alloc] init];
        for (int j = 0; j < GAME_SIZE; j++) {
            CGFloat blockXOffset = j * blockSize + j*5 +5;
            //Make the block view using the calculated offsets
            UIView *blockView = [[UIView alloc] initWithFrame:CGRectMake(blockXOffset, blockYOffset, blockSize, blockSize)];
            blockView.backgroundColor = [UIColor whiteColor];
            [rowViewArray addObject:blockView];
            [self.gameBoardView addSubview:blockView];
        }           //Add the entire row to our main array
        [self.blockViews addObject:rowViewArray];
    }
    //Extend the gameBoardView 5 pixels to account for the offsets
    self.gameBoardView.frame = CGRectMake(viewFrame.origin.x, viewFrame.origin.y, viewFrame.size.width + 5, viewFrame.size.height + 5);
    
}

- (IBAction)directionButtonPressed:(id)sender {
    UIButton *button = sender;
    [self.jSnakeConnect directionPressed:[NSString stringWithFormat:@"%ld", (long)button.tag]];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}



@end
