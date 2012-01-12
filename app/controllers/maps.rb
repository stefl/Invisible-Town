InvisibleTown.controllers :maps do
  
  get :home, :map => "/" do
    render 'maps/index'
  end
  
  get :index, :map => "/maps", :provides => [:json] do
    Map.all_json_summary(:hour => params[:hour]).to_json
  end
  
end
