# Laravel Goto Policy

This extension provides a quick way to navigate to a method in the policy class.

## Features

- [x] Navigate via the user model
- [x] Navigate via controller helpers
- [x] Navigate via blade templates
- [ ] Navigate via middleware

## Preview

![Preview](src/images/preview.gif)

## Extension Settings

- `laravel_goto_policy.policyPath`: Specify the path of the policy folder.
- `laravel_goto_policy.policyRegex`: Specify the regex to match the policy class name.
- `laravel_goto_policy.abilityRegex`: Specify the regex to match the ability method name.
- `laravel_goto_policy.argumentRegex`: Specify the regex to match the argument of the ability method.

## Known Issues

- The extenson does not currently support multiline arguments.
