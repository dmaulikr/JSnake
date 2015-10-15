//
//  ViewController.m
//  JSnake
//
//  Created by Joe Crozier on 2015-10-14.
//  Copyright © 2015 Joe Crozier. All rights reserved.
//

#import "ViewController.h"
#import "JSnake-Bridging-Header.h"
#import "JSnake-Swift.h"



@interface ViewController ()

@property SocketIOClient *socket;
@end

@implementation ViewController

- (void)viewDidLoad {
    
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
}

- (IBAction)button1Pressed:(id)sender {
    [self performSegueWithIdentifier:@"showGame" sender:nil];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
