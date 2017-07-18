require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "react-native-pspdfkit"
  s.version      = package['version']
  s.summary      = "PSPDFKit for React Native applications"
  s.authors		 = ["PSPDFKit"]

  s.homepage     = "https://github.com/PSPDFKit/react-native#readme"
  s.license      = package['license']
  s.platform     = :ios, "9.0"
  s.module_name  = 'PSPDFKit'
  s.source       = { :git => "https://github.com/PSPDFKit/react-native", :branch => "rad/podspec" }
  s.source_files  = "ios/RCTPSPDFKit/*.{h,m,swift}", "ios/RCTPSPDFKit/Converters/*.{h,m,swift}"

  s.dependency 'React', 'PSPDFKit'
  s.frameworks = 'UIKit'
end
