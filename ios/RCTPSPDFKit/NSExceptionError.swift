//
//  NSExceptionError.swift
//  react-native-pspdfkit
//
//  Created by Predrag Jevtic on 10/10/22.
//

import Foundation

public struct NSExceptionError: Swift.Error {

   public let exception: NSException

   public init(exception: NSException) {
      self.exception = exception
   }
}
