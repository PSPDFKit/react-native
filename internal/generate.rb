#!/usr/bin/env ruby

lines = STDIN.read

lines.scan(/@property \(.*\) (\S+) (\S+);/).each do |m|
  type = m.first
  property = m.last
  
  puts "SET(#{property}, #{type})"
end
