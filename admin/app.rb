class Admin < Padrino::Application
  register Padrino::Rendering
  register Padrino::Mailer
  register Padrino::Helpers
  register Padrino::Admin::AccessControl

  ##
  # Application configuration options
  #
  # set :raise_errors, true        # Raise exceptions (will stop application) (default for test)
  # set :dump_errors, true         # Exception backtraces are written to STDERR (default for production/development)
  # set :show_exceptions, true     # Shows a stack trace in browser (default for development)
  # set :logging, true             # Logging in STDOUT for development and file for production (default only for development)
  # set :public_folder, "foo/bar"  # Location for static assets (default root/public)
  # set :reload, false             # Reload application files (default in development)
  # set :default_builder, "foo"    # Set a custom form builder (default 'StandardFormBuilder')
  # set :locale_path, "bar"        # Set path for I18n translations (default your_app/locales)
  # disable :sessions              # Disabled sessions by default (enable if needed)
  # disable :flash                 # Disables sinatra-flash (enabled by default if Sinatra::Flash is defined)
  # layout  :my_layout             # Layout can be in views/layouts/foo.ext or views/foo.ext (default :application)
  #
  
  def date_field_tag(name, options={})
    options.reverse_merge!(:name => name)
    input_tag(:date, options)
  end
  
  def time_field_tag(name, options={})
    options.reverse_merge!(:name => name)
    input_tag(:time, options)
  end
  
  def number_field_tag(name, options={})
    options.reverse_merge!(:name => name)
    input_tag(:number, options)
  end

  set :login_page, "/admin/sessions/new"

  enable  :sessions
  disable :store_location

  access_control.roles_for :any do |role|
    role.protect "/"
    role.allow "/sessions"
  end

  access_control.roles_for :admin do |role|
    role.project_module :stories, "/stories"
    role.project_module :maps, "/maps"    
    role.project_module :doors, "/doors"
    role.project_module :accounts, "/accounts"
  end
end