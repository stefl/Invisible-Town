Admin.controllers :maps do

  get :index do
    @maps = Map.all
    render 'maps/index'
  end

  get :new do
    @map = Map.new
    render 'maps/new'
  end

  post :create do
    @map = Map.new(params[:map])
    if @map.save
      flash[:notice] = 'Map was successfully created.'
      redirect url(:maps, :edit, :id => @map.id)
    else
      render 'maps/new'
    end
  end

  get :edit, :with => :id do
    @map = Map.get(params[:id])
    render 'maps/edit'
  end

  put :update, :with => :id do
    @map = Map.get(params[:id])
    if @map.update(params[:map])
      flash[:notice] = 'Map was successfully updated.'
      redirect url(:maps, :edit, :id => @map.id)
    else
      render 'maps/edit'
    end
  end

  delete :destroy, :with => :id do
    map = Map.get(params[:id])
    if map.destroy
      flash[:notice] = 'Map was successfully destroyed.'
    else
      flash[:error] = 'Unable to destroy Map!'
    end
    redirect url(:maps, :index)
  end
end
