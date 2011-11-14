InvisibleTown.controllers :maps do
  
  get :home, :map => "/" do
    render 'maps/index'
  end
  
  get :index, :map => "/maps", :provides => [:json] do
    Map.all_json_summary.to_json
  end
  
  # get :index, :map => "/foo/bar" do
  #   session[:foo] = "bar"
  #   render 'index'
  # end

  # get :sample, :map => "/sample/url", :provides => [:any, :js] do
  #   case content_type
  #     when :js then ...
  #     else ...
  # end

  # get :foo, :with => :id do
  #   "Maps to url '/foo/#{params[:id]}'"
  # end

  # get "/example" do
  #   "Hello world!"
  # end

  
end
